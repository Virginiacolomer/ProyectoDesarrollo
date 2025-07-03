import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {Order} from './order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';
import { partialUpdateOrderDto } from './dto/partialUpdate-order.dto';
import { AuthGuard } from "../auth/guard/auth.guard";
import { RolesGuard } from "../auth/guard/roles.guard";
import { Role } from "../common/enums/role.enum";
import { Auth } from "../auth/decorators/auth.decorator";

@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Auth(Role.CLIENT)
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() createOrderDto: CreateOrderDto): Promise<any> {
    const order: Order = await this.ordersService.createOrder(createOrderDto);

    return {
      id: order.id,
      status: order.status,
      delivery: order.delivery,
      location: order.location,
    };
  }

  @Get()
  @Auth(Role.CLIENT)
  @UseGuards(AuthGuard, RolesGuard)
  async findAll(
  @Query('page') page = '1',
  @Query('limit') limit = '10'): Promise<any> {
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const { data, total } = await this.ordersService.getAllOrders(pageNumber, limitNumber);

  return {
    data: data.map(order => ({ 
      id: order.id,
      status: order.status.value,
      delivery: order.delivery,
      location: order.location,
    })),
    total,
    page: pageNumber,
    limit: limitNumber,
  };
}

  @Get(':id')
  @Auth(Role.CLIENT)
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(@Param('id') id: string): Promise<any> {
    const order = await this.ordersService.getOrderById(Number(id));
    return {
      id: order.id,
      status: order.status.value,
      delivery: order.delivery,
      location: order.location,
    };
  }

  @Put(':id')
  @Auth(Role.CLIENT)
  @UseGuards(AuthGuard, RolesGuard)
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<any> {
    const updatedOrder = await this.ordersService.updateOrder(Number(id), updateOrderDto);

    return {
      id: updatedOrder.id,
      status: updatedOrder.status.value,
      delivery: updatedOrder.delivery,
      location: updatedOrder.location,
    };
  }
 
  @Patch(':id')
  @Auth(Role.CLIENT)
  @UseGuards(AuthGuard, RolesGuard)
  async updatePartial(@Param('id') id: string, @Body() updateOrderDto: partialUpdateOrderDto): Promise<any> {
    const order = await this.ordersService.updatePartialOrder(Number(id), updateOrderDto);

    return {
      id: order.id,
      status: order.status.value,
      delivery: order.delivery,
      location: order.location,
    };
  }

  @Delete(':id')
  @Auth(Role.CLIENT)
  @UseGuards(AuthGuard, RolesGuard)
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.ordersService.deleteOrder(Number(id));
    return { message: 'deleted' };
  }
}
