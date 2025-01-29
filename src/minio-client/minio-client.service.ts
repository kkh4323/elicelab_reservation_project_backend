import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';
import { User } from '@user/entities/user.entity';
import { BufferedFile } from '@minio-client/file.model';
import * as crypto from 'crypto';
@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly baseBucket: string;
  public get client() {
    return this.minio.client;
  }
  constructor(
    private readonly minio: MinioService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger('MinioStorageService');
    this.baseBucket = this.configService.get<string>('MINIO_DEFAULT_BUCKETS');
  }

  public async uploadSpaceImgs(
    spaceId?: string,
    files?: BufferedFile[],
    categoryName?: string,
    baseBucket: string = this.baseBucket,
  ): Promise<string[]> {
    console.log(files);

    // Ensure files is an array before proceeding
    // if (!Array.isArray(files) || files.length < 1 || files.length > 10) {
    //   throw new HttpException(
    //     'You must upload between 1 or 10 files',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        console.log('file: ', file);
        if (
          !(
            file.mimetype.includes('jpg') ||
            file.mimetype.includes('jpeg') ||
            file.mimetype.includes('png')
          )
        ) {
          throw new HttpException(
            'Only jpg and png files are allowed.',
            HttpStatus.BAD_REQUEST,
          );
        }
        const temp_filename = Date.now().toString();
        console.log('temp_filename: ', temp_filename);
        const hashedFileName = crypto
          .createHash('md5')
          .update(temp_filename)
          .digest('hex');
        console.log('hashedFileName: ', hashedFileName);
        const ext = file.originalname.substring(
          file.originalname.lastIndexOf('.'),
          file.originalname.length,
        );
        const metaData = {
          'Content-Type': file.mimetype,
          'X-Amz-Meta-Testing': 1234,
        };
        const filename = hashedFileName + ext;
        const fileBuffer = file.buffer;
        console.log('fileBuffer: ', fileBuffer);
        const filePath = `${categoryName}/${spaceId}/${filename}`;
        console.log('filepath: ', filePath);

        if (`${categoryName}/${spaceId}`.includes(spaceId)) {
          await this.deleteFolderContents(
            this.baseBucket,
            `${categoryName}/${spaceId}/`,
          );
        }
        this.client.putObject(
          baseBucket,
          filePath,
          fileBuffer,
          fileBuffer.length,
          metaData,
          function (err) {
            console.log('==============================', err);
            if (err) {
              throw new HttpException(
                'Error uploading file',
                HttpStatus.BAD_REQUEST,
              );
            }
          },
        );
        const fileUrl = `http://localhost:${this.configService.get(
          'MINIO_PORT',
        )}/${this.configService.get('MINIO_DEFAULT_BUCKETS')}/${filePath}`;
        console.log('-=============', fileUrl);
        uploadedUrls.push(fileUrl);
      }
      return uploadedUrls;
    } catch (e) {
      console.log(e.message);
    }
  }

  public async uploadBannerImgs(
    bannerId?: string,
    files?: BufferedFile[],
    categoryName?: string,
    baseBucket: string = this.baseBucket,
  ): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (
        !(
          file.mimetype.includes('jpg') ||
          file.mimetype.includes('jpeg') ||
          file.mimetype.includes('png')
        )
      ) {
        throw new HttpException(
          'Only jpg and png files are allowed.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const temp_filename = Date.now().toString();
      const hashedFileName = crypto
        .createHash('md5')
        .update(temp_filename)
        .digest('hex');
      const ext = file.originalname.substring(
        file.originalname.lastIndexOf('.'),
        file.originalname.length,
      );
      const metaData = {
        'Content-Type': file.mimetype,
        'X-Amz-Meta-Testing': 1234,
      };
      const filename = hashedFileName + ext;
      const fileBuffer = file.buffer;
      const filePath = `${categoryName}/${filename}`;

      this.client.putObject(
        baseBucket,
        filePath,
        fileBuffer,
        fileBuffer.length,
        metaData,
        function (err) {
          console.log('==============================', err);
          if (err) {
            throw new HttpException(
              'Error uploading file',
              HttpStatus.BAD_REQUEST,
            );
          }
        },
      );
      const fileUrl = `http://localhost:${this.configService.get(
        'MINIO_PORT',
      )}/${this.configService.get('MINIO_DEFAULT_BUCKETS')}/${filePath}`;
      uploadedUrls.push(fileUrl);
    }
    return uploadedUrls;
  }

  public async uploadReferenceFile(
    questionId?: string,
    file?: BufferedFile,
    categoryName?: string,
    baseBucket: string = this.baseBucket,
  ): Promise<string> {
    if (!file.mimetype.includes('pdf')) {
      throw new HttpException(
        'Only pdf file is allowed.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const temp_filename = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(temp_filename)
      .digest('hex');
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };
    const filename = hashedFileName + ext;
    const fileBuffer = file.buffer;
    const filePath = `${categoryName}/${filename}`;

    this.client.putObject(
      baseBucket,
      filePath,
      fileBuffer,
      fileBuffer.length,
      metaData,
      function (err) {
        if (err) {
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
        }
      },
    );
    const fileUrl = `http://localhost:${this.configService.get(
      'MINIO_PORT',
    )}/${this.configService.get('MINIO_DEFAULT_BUCKETS')}/${filePath}`;

    return fileUrl;
  }

  public async uploadProfileImg(
    user: User,
    file: BufferedFile,
    categoryName: string,
    baseBucket: string = this.baseBucket,
  ): Promise<string> {
    console.log('file: ', file);
    if (
      !(
        file.mimetype.includes('jpg') ||
        file.mimetype.includes('jpeg') ||
        file.mimetype.includes('png')
      )
    ) {
      throw new HttpException(
        'Error uploading file type',
        HttpStatus.BAD_REQUEST,
      );
    }

    const temp_filename = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(temp_filename)
      .digest('hex');
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    console.log('++++++++++++++++test++++++++++++++++++');
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };
    const filename = hashedFileName + ext;
    const fileBuffer = file.buffer;
    const filePath = `${categoryName}/${user.id}/${filename}`;
    // if (`${categoryName}/${user.id}`.includes(user.id)) {
    //   await this.deleteFolderContents(
    //     this.baseBucket,
    //     `${categoryName}/${user.id}/`,
    //   );
    // }

    this.client.putObject(
      baseBucket,
      filePath,
      fileBuffer,
      fileBuffer.length,
      metaData,
      function (err) {
        console.log('err: ', err);
        if (err)
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
      },
    );

    return `http://${this.configService.get(
      'MINIO_ENDPOINT',
    )}:${this.configService.get('MINIO_PORT')}/${this.configService.get(
      'MINIO_DEFAULT_BUCKETS',
    )}/${filePath}`;
  }

  deleteFolderContents = async (bucketName, folderPath) => {
    const objectsList = [];
    const stream = this.client.listObjects(bucketName, folderPath, true);
    for await (const obj of stream) {
      objectsList.push(obj.name);
    }
    if (objectsList.length > 0) {
      const deleteResult = await this.client.removeObjects(
        bucketName,
        objectsList,
      );
      console.log('Deleted Objects:', deleteResult);
    } else {
      console.log('No Objects found to delete');
    }
  };
}
