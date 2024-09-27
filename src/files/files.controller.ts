import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, ParseFilePipeBuilder, HttpStatus, UploadedFiles, Req, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { join } from 'path';
import * as fs from 'fs';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('upload')
  @Public()
  @ResponseMessage('Upload Single File')
  @UseInterceptors(FileInterceptor('fileUpload'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename
    }


  }

  @Post('multipleUpload')
  @Public()
  @ResponseMessage('Upload Multiple File')
  @UseInterceptors(FilesInterceptor('filesUpload'))
  uploadMultipleFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return files.map((file) => {
      return {
        fileName: file.filename
      }
    })


  }


  @Delete('remove/:name')
  @Public()
  @ResponseMessage('Remove a file')
  removeFile(@Param('name') fileName: string, @Req() request: Request) {
    //@ts-ignore
    return fs.unlink(join(__dirname, '..', '..', 'public', 'images', `${request.headers.folder_type}`, `${fileName}`), (err) => {
      if (err) {

        return err
      }
    })


  }
}
