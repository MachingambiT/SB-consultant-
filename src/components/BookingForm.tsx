import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { services } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone is required'),
  service: z.string().min(1, 'Service selection is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Save to Firestore directly from client
      await addDoc(collection(db, 'bookings'), {
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      // Send email via backend
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      
      if (result.success) {
        toast.success('Booking Successful!', {
          description: 'We have received your request and will contact you shortly.',
        });
        reset();
      } else {
        toast.error('Booking Failed', {
          description: result.error || 'Please try again later.',
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Network Error', {
        description: 'Failed to submit booking. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="Tatenda Gumbo" className="bg-muted/50 border-none rounded-xl h-12" {...register('name')} />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="tatenda@example.com" className="bg-muted/50 border-none rounded-xl h-12" {...register('email')} />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" placeholder="+263 715 772 159" className="bg-muted/50 border-none rounded-xl h-12" {...register('phone')} />
        {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Service Required</Label>
        <Select onValueChange={(val: string) => setValue('service', val)}>
          <SelectTrigger className="bg-muted/50 border-none rounded-xl h-12">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((s) => (
              <SelectItem key={s.id} value={s.title}>
                {s.title} - {s.price}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.service && <p className="text-red-500 text-xs">{errors.service.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Preferred Date</Label>
          <Input id="date" type="date" className="bg-muted/50 border-none rounded-xl h-12 [&::-webkit-calendar-picker-indicator]:invert" {...register('date')} />
          {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Preferred Time</Label>
          <Input id="time" type="time" className="bg-muted/50 border-none rounded-xl h-12 [&::-webkit-calendar-picker-indicator]:invert" {...register('time')} />
          {errors.time && <p className="text-red-500 text-xs">{errors.time.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea id="notes" placeholder="Any specific requirements..." className="bg-muted/50 border-none rounded-xl min-h-[120px]" {...register('notes')} />
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl text-lg" disabled={isSubmitting}>
        {isSubmitting ? 'Booking...' : 'Book Appointment'}
      </Button>
    </form>
  );
}
