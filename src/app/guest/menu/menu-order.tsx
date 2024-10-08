'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useDishListQuery } from '@/app/queries/useDish';
import Quantity from '@/app/guest/menu/quantity';
import { useMemo, useState } from 'react';
import { cn, formatCurrency, handleErrorApi } from '@/lib/utils';
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema';
import { useRouter } from 'next/navigation';
import { useGuestOrderMutation } from '@/app/queries/useGuest';
import { DishStatus } from '@/constants/type';

export default function MenuOrder() {
  const { data } = useDishListQuery();
  const guestOrderMutation = useGuestOrderMutation();

  const router = useRouter();

  const dishes = useMemo(() => {
    return data?.payload.data || [];
  }, [data]);

  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrder) => {
      if (quantity === 0) {
        return prevOrder.filter((dish) => dish.dishId !== dishId);
      }

      const dishIndex = prevOrder.findIndex((dish) => dish.dishId === dishId);

      if (dishIndex === -1) {
        return [...prevOrder, { dishId, quantity }];
      }

      const newOrder = [...prevOrder];
      newOrder[dishIndex].quantity = quantity;
      return newOrder;
    });
  };

  const totalPrice = useMemo(() => {
    return orders.reduce((total, order) => {
      return total + (dishes.find((dish) => dish.id === order.dishId)?.price ?? 0) * order.quantity;
    }, 0);
  }, [dishes, orders]);

  const handleGuestOrder = async () => {
    try {
      await guestOrderMutation.mutateAsync(orders);
      router.push('/guest/orders');
      setOrders([]);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <>
      {dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
          <div
            key={dish.id}
            className={cn('flex gap-4', {
              'pointer-events-none': dish.status === DishStatus.Unavailable
            })}
          >
            <div className='flex-shrink-0 relative'>
              {dish.status === DishStatus.Unavailable && (
                <span className='absolute inset-0 flex justify-center items-center'>Hết hàng</span>
              )}
              <Image
                src={dish.image}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                className='object-cover w-[80px] h-[80px] rounded-md'
              />
            </div>
            <div className='space-y-1'>
              <h3 className='text-sm'>{dish.name}</h3>
              <p className='text-xs'>{dish.description}</p>
              <p className='text-xs font-semibold'>{formatCurrency(dish.price)}</p>
            </div>
            <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
              <Quantity
                onChange={(value) => handleQuantityChange(dish.id, value)}
                value={orders.find((order) => order.dishId === dish.id)?.quantity || 0}
                disabled={dish.status === DishStatus.Unavailable}
              />
            </div>
          </div>
        ))}
      <div className='sticky bottom-0'>
        <Button className='w-full flex space-x-4' onClick={handleGuestOrder} disabled={orders.length === 0}>
          <span>Đặt hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  );
}
