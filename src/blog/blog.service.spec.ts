import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { NotFoundException } from '@nestjs/common';

describe('BlogService', () => {
  let service: BlogService;
  let blogRepository: Repository<Blog>;

  const mockBlogRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: getRepositoryToken(Blog),
          useValue: mockBlogRepository,
        },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
    blogRepository = module.get<Repository<Blog>>(getRepositoryToken(Blog));
  });

  afterEach(() => {
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
        isActive: true,
        ...createDto,
        createdAt: new Date(),
      };

      mockBlogRepository.update.mockResolvedValue({ affected: 1 });
      mockBlogRepository.create.mockReturnValue(savedPost);
      mockBlogRepository.save.mockResolvedValue(savedPost);

      const result = await service.create(createDto);

      expect(mockBlogRepository.update).toHaveBeenCalledWith(
        { isActive: true },
        { isActive: false },
      );
      expect(mockBlogRepository.create).toHaveBeenCalledWith({
        ...createDto,
        isActive: true,
      });
      expect(mockBlogRepository.save).toHaveBeenCalledWith(savedPost);
      expect(result).toEqual(savedPost);
    });
  });

  describe('findAll', () => {
    it('should return an array of blogs ordered by createdAt DESC', async () => {
      const mockBlogs = [
        {
          id: 1,
          titulo: 'Test 1',
          createdAt: new Date('2023-01-02'),
        },
        {
          id: 2,
          titulo: 'Test 2',
          createdAt: new Date('2023-01-01'),
        },
      ];

      mockBlogRepository.find.mockResolvedValue(mockBlogs);

      const result = await service.findAll();

      expect(mockBlogRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockBlogs);
    });
  });

  describe('findOne', () => {
    it('should return a single blog post', async () => {
      const mockBlog = {
        id: 1,
        titulo: 'Test Title',
      };

      mockBlogRepository.findOneBy.mockResolvedValue(mockBlog);

      const result = await service.findOne(1);

      expect(mockBlogRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockBlog);
    });

    it('should return null if post not found', async () => {
      mockBlogRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the blog post', async () => {
      const existingPost = {
        id: 1,
        titulo: 'Old Title',
        subtitulo: 'Old Subtitle',
      };

      const updateDto: UpdateBlogDto = {
        titulo: 'New Title',
      };

      const updatedPost = {
        ...existingPost,
        ...updateDto,
      };

      mockBlogRepository.findOneBy.mockResolvedValue(existingPost);
      mockBlogRepository.save.mockResolvedValue(updatedPost);

      const result = await service.update(1, updateDto);

      expect(mockBlogRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockBlogRepository.save).toHaveBeenCalledWith(updatedPost);
      expect(result).toEqual(updatedPost);
    });

    it('should throw NotFoundException if post not found', async () => {
      mockBlogRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('repost', () => {
    it('should deactivate all posts and activate the specified one', async () => {
      const existingPost = {
        id: 1,
        titulo: 'Test Title',
        isActive: false,
      };

      mockBlogRepository.findOneBy.mockResolvedValue(existingPost);
      mockBlogRepository.update.mockResolvedValue({ affected: 1 });
      mockBlogRepository.save.mockResolvedValue({
        ...existingPost,
        isActive: true,
      });

      const result = await service.repost(1);

      expect(mockBlogRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockBlogRepository.update).toHaveBeenCalledWith(
        { isActive: true },
        { isActive: false },
      );
      expect(mockBlogRepository.save).toHaveBeenCalledWith({
        ...existingPost,
        isActive: true,
      });
      expect(result.isActive).toBe(true);
    });

    it('should throw NotFoundException if post not found', async () => {
      mockBlogRepository.findOneBy.mockResolvedValue(null);

      await expect(service.repost(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete the blog post', async () => {
      mockBlogRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockBlogRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});