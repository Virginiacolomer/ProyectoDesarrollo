import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { State } from './state.entity'; 
import { UpdateOrderDto } from './dto/update-order.dto'; 
import { partialUpdateOrderDto } from './dto/partialUpdate-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepository: Repository<Order>,
    @InjectRepository(State) private readonly stateRepository: Repository<State>) {}

  async createOrder(data: CreateOrderDto): Promise<Order> {
    // Por defecto,asignammos pending,por eso lo buscamos en la bd
    const defaultState = await this.stateRepository.findOne({ where: { value: 'pending' } });
    if (!defaultState) {
      throw new NotFoundException('Default state "pending" not found');
    }
    const newOrder = this.ordersRepository.create({
      ...data,
      status: defaultState,
      delivery: null,
    });
    return this.ordersRepository.save(newOrder);
  }

  async getAllOrders(page = 1, limit = 10): Promise<{ data: Order[]; total: number }> {
  const [result, total] = await this.ordersRepository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
    order: { id: 'ASC' },
    relations: ['status']
  });

  return {
    data: result,
    total: total
  };
  }

  async getOrdersByUser(userId: number, page = 1, limit = 10): Promise<{ data: Order[]; total: number }> {
  const [result, total] = await this.ordersRepository.findAndCount({
    where: { userId },
    skip: (page - 1) * limit,
    take: limit,
    order: { id: 'ASC' },
    relations: ['status'],
  });

  return {
    data: result,
    total,
  };
}

  async getOrderById(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id }, relations: ['status'] });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async updateOrder(id: number, data:UpdateOrderDto): Promise<Order> {
    const newStatus = await this.stateRepository.findOne({ where: { value: data.status } });

    //La validacion de abajo esta para que no tire error cuando actuliza, sino encuentra un estado valido
    if (!newStatus) {
      throw new NotFoundException(`Status with value ${data.status} not found`);
    }

    //Esta linea actualza la orden(data) con el id dado
    await this.ordersRepository.update(id, {
    ...data,
    status: newStatus  // asignamos el objeto completo
  });
    
    const updatedOrder = await this.ordersRepository.findOne({
      where: { id },             
      relations: ['status']});

    if (!updatedOrder) {
      throw new NotFoundException(`Order with id ${id} not found`);}

  return updatedOrder;
  }

  async updatePartialOrder(id: number, data: partialUpdateOrderDto): Promise<Order> {
    //Esta linea busca el objeto status por su nombre en la base de datos
    const newStatus = await this.stateRepository.findOne({ where: { value: data.status } });

    //La validacion de abajo esta para que no tire error cuando actuliza, sino encuentra un estado valido
    if (!newStatus) {
      throw new NotFoundException(`Status with value ${data.status} not found`);}

    await this.ordersRepository.update(id, {
    ...data,
    status: newStatus});

    const updatedOrder = await this.ordersRepository.findOne({ 
      where: { id },
      relations: ['status']  // Aseguramos que el estado se cargue
     });
     
    if (!updatedOrder) {
      throw new NotFoundException(`Order with id ${id} not found`);}

   return updatedOrder;
    };

  async deleteOrder(id: number): Promise<void> {
    const result = await this.ordersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
  }
}


