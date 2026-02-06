import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('Auth / Users')
@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'Get current user',
    description:
      'Returns the currently signed-in user from the session. Requires authentication.',
  })
  @ApiCookieAuth('express:sess')
  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @ApiOperation({
    summary: 'Sign out',
    description: 'Clears the session and signs the user out.',
  })
  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @ApiOperation({
    summary: 'Register new user',
    description: 'Creates a new account and signs the user in (sets session cookie).',
  })
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @ApiOperation({
    summary: 'Sign in',
    description: 'Authenticates user and sets session cookie.',
  })
  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Returns a user by their ID.',
  })
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @ApiOperation({
    summary: 'List users',
    description: 'Returns all users, optionally filtered by email query parameter.',
  })
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @ApiOperation({
    summary: 'Delete user',
    description: 'Deletes a user by ID.',
  })
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @ApiOperation({
    summary: 'Update user',
    description: 'Updates a user by ID. All body fields are optional.',
  })
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
