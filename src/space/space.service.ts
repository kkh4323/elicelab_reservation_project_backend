import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Space } from '@space/entities/space.entity';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateSpaceDto } from '@space/dto/create-space.dto';
import { MinioClientService } from '@minio-client/minio-client.service';
import { BufferedFile } from '@minio-client/file.model';
import { SpacePageOptionsDto } from '@root/common/dto/space-page-options.dto';
import { PageMetaDto } from '@root/common/dto/page-meta.dto';
import { PageDto } from '@root/common/dto/page.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(Space)
    private spaceRepository: Repository<Space>,
    private readonly minioClientService: MinioClientService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  // [관리자] 공간 생성하는 로직
  async createSpace(
    createSpaceDto?: CreateSpaceDto,
    images?: BufferedFile[],
  ): Promise<Space> {
    return await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const newSpace: Space = this.spaceRepository.create(createSpaceDto);
        const savedSpace = await transactionalEntityManager.save(newSpace);

        let spaceImgs: string[] = [];
        if (images && images.length > 0) {
          spaceImgs = await this.minioClientService.uploadSpaceImgs(
            savedSpace.id,
            images,
            'space',
          );
        }

        savedSpace.spaceImgs = spaceImgs;
        const updatedSpace = await transactionalEntityManager.save(savedSpace);

        return updatedSpace;
      },
    );
  }

  // 공간 전체 가져오는 로직
  async getSpaces(spacePageOptionsDto: SpacePageOptionsDto) {
    const queryBuilder = this.spaceRepository.createQueryBuilder('space');
    if (spacePageOptionsDto.name) {
      queryBuilder.andWhere('space.name = :name', {
        name: spacePageOptionsDto.name,
      });
    }
    if (spacePageOptionsDto.zone) {
      queryBuilder.andWhere('space.zone = :zone', {
        zone: spacePageOptionsDto.zone,
      });
    }
    if (spacePageOptionsDto.location) {
      queryBuilder.andWhere('space.location = :location', {
        location: spacePageOptionsDto.location,
      });
    }
    queryBuilder
      .orderBy('space.name', spacePageOptionsDto.order)
      .skip(spacePageOptionsDto.skip)
      .take(spacePageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: spacePageOptionsDto,
    });
    return new PageDto(entities, pageMetaDto);
  }

  // 상세 공간 가져오는 로직
  async getSpaceById(id: string): Promise<Space> {
    const space: Space = await this.spaceRepository.findOneBy({ id });
    if (!space)
      throw new HttpException('Space is not exist', HttpStatus.NOT_FOUND);
    return space;
  }

  // [관리자] 공간 수정하는 로직
  async updateSpaceById(
    id: string,
    updateSpaceDto: CreateSpaceDto,
  ): Promise<string> {
    const space: UpdateResult = await this.spaceRepository.update(
      id,
      updateSpaceDto,
    );
    if (space.affected) return `${updateSpaceDto.name} is updated`;
    throw new HttpException(
      `Space(id: ${id}) is not exist`,
      HttpStatus.NOT_FOUND,
    );
  }

  // [관리자] 공간 삭제하는 로직
  async deleteSpaceById(id: string): Promise<string> {
    const space = await this.spaceRepository.findOneBy({ id });
    if (!space) {
      throw new HttpException(
        `Space(id: ${id}) is not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    const bucketName = this.configService.get('MINIO_BUCKET');
    const folderPath = `space/${id}`;
    await this.minioClientService.deleteFolderContents(bucketName, folderPath);

    const result: DeleteResult = await this.spaceRepository.delete({ id });
    if (result.affected) return `Space(id: ${id}) is deleted successfully`;
    throw new HttpException(
      `Space(id: ${id}) is not exist`,
      HttpStatus.NOT_FOUND,
    );
  }
}
