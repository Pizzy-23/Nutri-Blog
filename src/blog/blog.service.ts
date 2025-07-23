import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async create(dto: CreateBlogDto): Promise<Blog> {
    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.update(
          Blog,
          { isActive: true },
          { isActive: false },
        );
        const newPost = transactionalEntityManager.create(Blog, {
          ...dto,
          isActive: true,
        });
        return transactionalEntityManager.save(newPost);
      },
    );
  }
  findAll(): Promise<Blog[]> {
    return this.blogRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Blog> {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) {
      throw new NotFoundException(`Blog com ID #${id} não encontrado.`);
    }
    return blog;
  }
  async update(id: number, dto: UpdateBlogDto): Promise<Blog> {
    const post = await this.findOne(id);
    if (!post) throw new NotFoundException('Post não encontrado');

    Object.assign(post, dto);
    return this.blogRepository.save(post);
  }

  async repost(id: number): Promise<Blog> {
    const postToRepost = await this.findOne(id);

    return this.entityManager.transaction(async (manager) => {
      await manager.update(Blog, { isActive: true }, { isActive: false });
      postToRepost.isActive = true;
      return manager.save(postToRepost); 
    });
  }
  async remove(id: number): Promise<void> {
  await this.findOne(id); 
  await this.blogRepository.delete(id);
}
}
