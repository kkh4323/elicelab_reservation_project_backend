import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from '@banner/entities/banner.entity';
import { DeleteResult, Repository } from 'typeorm';
import { MinioClientService } from '@minio-client/minio-client.service';
import { BufferedFile } from '@minio-client/file.model';
import { CreateBannerDto } from '@banner/dto/create-banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
    private readonly minioClientService: MinioClientService,
  ) {}

  // [관리자] 배너 등록하는 로직
  async createBanner(
    createBannerDto: CreateBannerDto,
    images: BufferedFile[],
  ): Promise<Banner> {
    const newBanner: Banner =
      await this.bannerRepository.create(createBannerDto);
    await this.bannerRepository.save(newBanner);
    const bannerImgs: string[] = await this.minioClientService.uploadBannerImgs(
      newBanner.id,
      images,
      'banner',
    );
    newBanner.bannerImgs = bannerImgs;
    await this.bannerRepository.save(newBanner);
    return newBanner;
  }

  // 배너 조회하는 로직
  async getBanners(): Promise<Banner[]> {
    const banners: Banner[] = await this.bannerRepository.find();
    return banners;
  }

  // [관리자] 배너 삭제하는 로직
  async deleteBannerById(id: string): Promise<string> {
    const result: DeleteResult = await this.bannerRepository.delete({ id });
    if (result.affected) return `Banner(id: ${id}) is deleted successfully`;
    throw new HttpException(
      `Banner(id: ${id}) is not exist`,
      HttpStatus.NOT_FOUND,
    );
  }
}
