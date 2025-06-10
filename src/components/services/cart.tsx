'use client';

import { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Calendar, Clock, CreditCard, Smartphone, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useCartItems, useCartTotal, useServicesActions } from '@/lib/stores/services-store';
import { useUser } from '@clerk/nextjs';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const cartItems = useCartItems();
  const cartTotal = useCartTotal();
  const { removeFromCart, updateCartItem, clearCart, createOrder } = useServicesActions();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'paypal' | 'razorpay'>('upi');
  const [customerDetails, setCustomerDetails] = useState({
    name: user?.fullName || '',
    email: user?.emailAddresses[0]?.emailAddress || '',
    phone: '',
    address: '',
  });

  const handleQuantityChange = (serviceId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(serviceId);
    } else {
      updateCartItem(serviceId, { quantity: newQuantity });
    }
  };

  const handleDateTimeChange = (serviceId: string, date: Date, time: string) => {
    updateCartItem(serviceId, { selectedDate: date, selectedTimeSlot: time });
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to complete your purchase',
        variant: 'destructive',
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: 'Cart Empty',
        description: 'Please add services to your cart before checkout',
        variant: 'destructive',
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      // Create order
      const order = await createOrder(cartItems);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful order
      clearCart();
      
      toast({
        title: 'Order Placed Successfully!',
        description: `Your order #${order.id} has been placed. Vendors will contact you soon.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Order Failed',
        description: 'There was an error processing your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const generateUPIQR = () => {
    // Generate UPI QR code URL (this would typically be done on the backend)
    const upiString = `upi://pay?pa=matrimony@paytm&pn=Matrimony Services&am=${cartTotal}&cu=INR&tn=Service Payment`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Shopping Cart ({cartItems.length} items)
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600">Add some services to get started</p>
                </CardContent>
              </Card>
            ) : (
              cartItems.map((item) => (
                <Card key={item.serviceId}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.service.images[0] || '/api/placeholder/100/100'}
                        alt={item.service.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{item.service.name}</h3>
                            <p className="text-sm text-gray-600">{item.service.vendorName}</p>
                            <Badge variant="outline" className="mt-1">
                              {item.service.category}
                            </Badge>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.serviceId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.serviceId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.serviceId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium">₹{(item.service.price * item.quantity).toLocaleString()}</p>
                            <p className="text-sm text-gray-600">₹{item.service.price.toLocaleString()} each</p>
                          </div>
                        </div>
                        
                        {/* Date/Time Selection */}
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Preferred Date</Label>
                            <Input
                              type="date"
                              value={item.selectedDate?.toISOString().split('T')[0] || ''}
                              onChange={(e) => {
                                const date = new Date(e.target.value);
                                handleDateTimeChange(item.serviceId, date, item.selectedTimeSlot || '');
                              }}
                              className="text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Preferred Time</Label>
                            <Select
                              value={item.selectedTimeSlot || ''}
                              onValueChange={(time) => {
                                handleDateTimeChange(item.serviceId, item.selectedDate || new Date(), time);
                              }}
                            >
                              <SelectTrigger className="text-xs">
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                                <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
                                <SelectItem value="evening">Evening (4 PM - 8 PM)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {/* Custom Requirements */}
                        <div className="mt-2">
                          <Label className="text-xs">Special Requirements</Label>
                          <Textarea
                            placeholder="Any special requirements or notes..."
                            value={item.customRequirements || ''}
                            onChange={(e) => updateCartItem(item.serviceId, { customRequirements: e.target.value })}
                            className="text-xs mt-1"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Order Summary & Checkout */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>₹{Math.round(cartTotal * 0.05).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{Math.round(cartTotal * 0.18).toLocaleString()}</span>
                </div>
                <hr />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>₹{Math.round(cartTotal * 1.23).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Textarea
                    value={customerDetails.address}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('upi')}
                    className="flex flex-col items-center p-3 h-auto"
                  >
                    <Smartphone className="h-5 w-5 mb-1" />
                    <span className="text-xs">UPI</span>
                  </Button>
                  <Button
                    variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('paypal')}
                    className="flex flex-col items-center p-3 h-auto"
                  >
                    <DollarSign className="h-5 w-5 mb-1" />
                    <span className="text-xs">PayPal</span>
                  </Button>
                  <Button
                    variant={paymentMethod === 'razorpay' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('razorpay')}
                    className="flex flex-col items-center p-3 h-auto"
                  >
                    <CreditCard className="h-5 w-5 mb-1" />
                    <span className="text-xs">Razorpay</span>
                  </Button>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="text-center">
                    <img
                      src={generateUPIQR()}
                      alt="UPI QR Code"
                      className="mx-auto mb-2"
                    />
                    <p className="text-xs text-gray-600">Scan QR code to pay via UPI</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || isCheckingOut}
              className="w-full bg-rose-600 hover:bg-rose-700"
              size="lg"
            >
              {isCheckingOut ? 'Processing...' : `Pay ₹${Math.round(cartTotal * 1.23).toLocaleString()}`}
            </Button>

            {cartItems.length > 0 && (
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full"
              >
                Clear Cart
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
