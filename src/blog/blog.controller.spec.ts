import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from '../admin/jwt/jwt-auth.guard';

describe('BlogController', () => {
  let controller: BlogController;
  let blogService: BlogService;

  const mockBlogService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    repost: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [
        {
          provide: BlogService,
          useValue: mockBlogService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BlogController>(BlogController);
    blogService = module.get<BlogService>(BlogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service.create with the DTO', async () => {
      const createDto: CreateBlogDto = {
        titulo: 'Test Title',
        subtitulo: 'Test Subtitle',
        conteudo: 'Test Content',
        imagemUrl: 'test.jpg',
      };

      const expectedResult = { id: 1, ...createDto };
      mockBlogService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(blogService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of blog posts', async () => {
      const expectedResult = [
        { id: 1, titulo: 'Test 1' },
        { id: 2, titulo: 'Test 2' },
      ];
      mockBlogService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(blogService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single blog post', async () => {
      const expectedResult = { id: '1', titulo: 'Test Title' };
      mockBlogService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(blogService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call service.update with id and DTO', async () => {
      const updateDto: UpdateBlogDto = { titulo: 'Updated Title' };
      const expectedResult = { id: 1, titulo: 'Updated Title' };
      mockBlogService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateDto);

      expect(blogService.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('repost', () => {
    it('should call service.repost with id', async () => {
      const expectedResult = { id: 1, isActive: true };
      mockBlogService.repost.mockResolvedValue(expectedResult);

      const result = await controller.repost('1');

      expect(blogService.repost).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });
});