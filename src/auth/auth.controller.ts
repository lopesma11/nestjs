import {
  Body,
  Controller,
  Post,
  Headers,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthForgetPasswordDTO } from './dto/auth-forget-password.dto';
import { AuthResetPasswordDTO } from './dto/auth-reset-password.dto';
import { UserService } from 'src/user/user.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthService } from './auth.service';
import { AuthMeDTO } from './dto/auth-me-jwt.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { FileService } from 'src/file/file.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}
  @Post('login')
  async loginUser(@Body() { email, password }: AuthLoginDTO) {
    return this.authService.loginUser(email, password);
  }

  @Post('register')
  async registerUser(@Body() body: AuthRegisterDTO) {
    return this.authService.registerUser(body);
  }

  @Post('forget')
  async forgetPassword(@Body() { email }: AuthForgetPasswordDTO) {
    return this.authService.forgetPassword(email);
  }

  @Post('reset')
  async resetPassword(@Body() { password, token }: AuthResetPasswordDTO) {
    return this.authService.resetPassword(password, token);
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User() user) {
    return { user };
  }

  // @UseInterceptors(FileInterceptor('file'))
  // @UseGuards(AuthGuard)
  // @Post('photo')
  // async uploadPhoto(
  //   @User() user,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new FileTypeValidator({
  //           fileType: 'image/jpeg',
  //         }),
  //         new MaxFileSizeValidator({
  //           {maxSize: 1024 * 20},
  //         }),
  //       ],
  //     }),
  //   )
  //   photo: Express.Multer.File,
  // ) {
  //   const path = join(
  //     __dirname,
  //     '..',
  //     '..',
  //     'storage',
  //     'photos',
  //     `photo-${user.id}.png`,
  //   );

  //   try {
  //     await this.fileService.upload(photo, path);
  //   } catch (e) {
  //     throw new BadRequestException(e);
  //   }
  //   return { photo };
  // }

  // @UseInterceptors(FilesInterceptor('files'))
  // @UseGuards(AuthGuard)
  // @Post('files')
  // async uploadFiles(
  //   @User() user,
  //   @UploadedFiles() files: Express.Multer.File[],
  // ) {
  //   return files;
  // }

  // @UseInterceptors(
  //   FileFieldsInterceptor([
  //     {
  //       name: 'photo',
  //       maxCount: 1,
  //     },
  //     { name: 'documents', maxCount: 10 },
  //   ]),
  // )
  // @UseGuards(AuthGuard)
  // @Post('files-fields')
  // async uploadFilesFields(
  //   @User() user,
  //   @UploadedFiles()
  //   files: { photo: Express.Multer.File; documents: Express.Multer.File[] },
  // ) {
  //   return { photo, documents };
  // }
}
