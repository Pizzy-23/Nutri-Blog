import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { NotFoundException } from '@nestjs/common';

const mockBlogRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockEntityManager = {
  transaction: jest.fn().mockImplementation(async (callback) => {
    const transactionalManager = {
      update: mockBlogRepository.update,
      create: mockBlogRepository.create,
      save: mockBlogRepository.save,
    };
    return callback(transactionalManager);
  }),
};

describe('BlogService', () => {
  let service: BlogService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        { provide: getRepositoryToken(Blog), useValue: mockBlogRepository },
        { provide: EntityManager, useValue: mockEntityManager },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
    entityManager = module.get<EntityManager>(EntityManager);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should deactivate all posts and create a new active one', async () => {
      const createDto: CreateBlogDto = {
        titulo: 'Test Title',
        subtitulo: 'Test Subtitle',
        conteudo: 'Test Content',
        imagemUrl: 'test.jpg',
      };
      const savedPost = {
        id: 1,
        ...createDto,
        isActive: true,
        createdAt: new Date(),
      };

      mockBlogRepository.create.mockReturnValue(savedPost);
      mockBlogRepository.save.mockResolvedValue(savedPost);

      await service.create(createDto);
      expect(entityManager.transaction).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of blogs', async () => {
      mockBlogRepository.find.mockResolvedValue([{}]);
      await service.findAll();
      expect(mockBlogRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find and return a blog', async () => {
      mockBlogRepository.findOneBy.mockResolvedValue({ id: 1 });
      const result = await service.findOne(1);
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if not found', async () => {
      mockBlogRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a blog post', async () => {
      mockBlogRepository.findOneBy.mockResolvedValue({ id: 1 });
      mockBlogRepository.save.mockResolvedValue({});
      await service.update(1, { titulo: 'New Title' });
      expect(mockBlogRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if post to update is not found', async () => {
      mockBlogRepository.findOneBy.mockResolvedValue(null);
      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  // Testes de 'repost'
  describe('repost', () => {
    it('should repost and return the activated post', async () => {
      const postToRepost = { id: 1, isActive: false };
      mockBlogRepository.findOneBy.mockResolvedValue(postToRepost);
      mockBlogRepository.save.mockResolvedValue({
        ...postToRepost,
        isActive: true,
      });

      const result = await service.repost(1);
      expect(result.isActive).toBe(true);
    });
  });

  // Teste de 'remove'
  describe('remove', () => {
    it('should delete the blog post', async () => {
      mockBlogRepository.findOneBy.mockResolvedValue({ id: 1 });
      mockBlogRepository.delete.mockResolvedValue({ affected: 1 });
      await expect(service.remove(1)).resolves.not.toThrow();
      expect(mockBlogRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if post to remove is not found', async () => {
      mockBlogRepository.findOneBy.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
