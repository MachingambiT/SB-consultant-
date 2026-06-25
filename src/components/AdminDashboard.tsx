import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading bookings...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard - Bookings</h1>
        <a href="#" className="text-sm font-medium hover:underline text-primary">Back to Website</a>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bookings.length === 0 ? (
          <p className="text-muted-foreground">No bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <CardTitle>{booking.name}</CardTitle>
                <div className="text-sm text-muted-foreground">{new Date(booking.createdAt).toLocaleString()}</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Service:</strong> {booking.service}</p>
                  <p><strong>Date:</strong> {booking.date} at {booking.time}</p>
                  <p><strong>Email:</strong> {booking.email}</p>
                  <p><strong>Phone:</strong> {booking.phone}</p>
                  {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
                  <p><strong>Status:</strong> <span className="capitalize">{booking.status}</span></p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
