import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';
import { User } from '@user/entities/user.entity';
import { BufferedFile } from '@minio-client/file.model';
import * as crypto from 'node:crypto';
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
    this.baseBucket = this.configService.get<string>('MINIO_BUCKET');
  }
  public async uploadProfileImg(
    user: User,
    file: BufferedFile,
    categoryName: string,
    baseBucket: string = this.baseBucket,
  ): Promise<string> {
    if (!(file.mimetype.includes('jpg') || file.mimetype.includes('png'))) {
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
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };
    const filename = hashedFileName + ext;
    const fileBuffer = file.buffer;
    const filePath = `${categoryName}/${user.id}/${filename}`;
    if (`${categoryName}/${user.id}`.includes(user.id)) {
      await this.deleteFolderContents(
        this.baseBucket,
        `${categoryName}/${user.id}/`,
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
        if (err)
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
      },
    );
    return `http://${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${this.configService.get('MINIO_BUCKET')}/${filePath}`;
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
