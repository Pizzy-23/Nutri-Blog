import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) { }

  async create(dto: CreateBlogDto): Promise<Blog> {
    await this.blogRepository.update({ isActive: true }, { isActive: false });

    const newPost = this.blogRepository.create({ ...dto, isActive: true });
    return this.blogRepository.save(newPost);
  }

  findAll(): Promise<Blog[]> {
    return this.blogRepository.find({ order: { createdAt: 'DESC' } });
  }

  findOne(id: number): Promise<Blog> {
    return this.blogRepository.findOneBy({ id });
  }

  async update(id: number, dto: UpdateBlogDto): Promise<Blog> {
    const post = await this.findOne(id);
    if (!post) throw new NotFoundException('Post não encontrado');

    Object.assign(post, dto);
    return this.blogRepository.save(post);
  }

  async repost(id: number): Promise<Blog> {
    const post = await this.findOne(id);
    if (!post) throw new NotFoundException('Post não encontrado');

    await this.blogRepository.update({ isActive: true }, { isActive: false });

    post.isActive = true;
    return this.blogRepository.save(post);
  }

  remove(id: number) {
    return this.blogRepository.delete(id);
  }
}
