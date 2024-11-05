import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Space } from '@space/entities/space.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateSpaceDto } from '@space/dto/create-space.dto';
import { MinioClientService } from '@minio-client/minio-client.service';
import { User } from '@user/entities/user.entity';
import { BufferedFile } from '@minio-client/file.model';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(Space)
    private spaceRepository: Repository<Space>,
    private readonly minioClientService: MinioClientService,
  ) {}

  // [관리자] 공간 생성하는 로직
  async createSpace(createSpaceDto?: CreateSpaceDto, images?: BufferedFile[]) {
    const newSpace: Space = await this.spaceRepository.create(createSpaceDto);
    await this.spaceRepository.save(newSpace);
    const spaceImgs = await this.minioClientService.uploadSpaceImgs(
      newSpace.id,
      images,
      'space',
    );
    newSpace.spaceImgs = spaceImgs;
    await this.spaceRepository.save(newSpace);
    return newSpace;
  }

  // 공간 전체 가져오는 로직
  async getSpaces(): Promise<Space[]> {
    return await this.spaceRepository.find({});
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
    const result: DeleteResult = await this.spaceRepository.delete({ id });
    if (result.affected) return `Space(id: ${id}) is deleted successfully`;
    throw new HttpException(
      `Space(id: ${id}) is not exist`,
      HttpStatus.NOT_FOUND,
    );
  }
}
