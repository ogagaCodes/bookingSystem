import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  Query,
  ParseBoolPipe,
  DefaultValuePipe,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly service: BookingsService) {}

  @Post()
  @Roles('provider', 'admin')
  async create(@Req() req: any, @Body() dto: CreateBookingDto) {
    const providerId = req.user?.id;
    if (!providerId) {
      throw new ForbiddenException('Provider not found');
    }
    const booking = await this.service.create(providerId, dto);
    return booking;
  }

  @Get(':id')
  @Roles('provider', 'admin')
  async findById(@Req() req: any, @Param('id') id: string) {
    const user = req.user;
    const isAdmin = user?.roles?.includes('admin');
    const providerId = isAdmin ? undefined : user?.id;
    const booking = await this.service.findById(id, providerId);
    if (!booking) {
      throw new ForbiddenException('Booking not found');
    }
    return booking;
  }

  @Get()
  @Roles('provider', 'admin')
  async list(
    @Req() req: any,
    @Query('past', new DefaultValuePipe(false), ParseBoolPipe) past: boolean,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const user = req.user;
    const isAdmin = user?.roles?.includes('admin');
    const providerId = isAdmin ? undefined : user?.id;
    return this.service.list(past, page, limit, providerId);
  }
}