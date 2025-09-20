import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useToast } from "@/context/ToastContext";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Get event details from navigation state
  const eventDetails = location.state?.eventDetails || {
    title: "Sample Event",
    price: 5000, // in kobo (₦50)
    date: "Aug 10, 2025",
    location: "Sample Location",
  };

  const [paymentData, setPaymentData] = useState({
    email: "",
    amount: eventDetails.price,
    reference: `event_${Date.now()}`,
  });

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // In a real app, you would integrate with Paystack here
      // For now, we'll simulate the payment process
      console.log("Processing payment with Paystack:", paymentData);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      showToast(
        "Payment successful! You have been registered for the event.",
        "success"
      );
      navigate("/explore");
    } catch (error) {
      console.error(error);
      showToast("Payment failed. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (amount: number) => {
    return `₦${(amount / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Event Details
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Event:</span>
              <span className="font-medium">{eventDetails.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span>{eventDetails.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span>{eventDetails.location}</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-bg-primary-dark2">
                {formatPrice(eventDetails.price)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="h-5 w-5 text-bg-primary-dark2 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={paymentData.email}
                onChange={(e) =>
                  setPaymentData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter your email"
                className="mt-1"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center text-blue-800 text-sm">
                <Lock className="h-4 w-4 mr-2" />
                <span>Your payment is secured by Paystack</span>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={!paymentData.email || isProcessing}
              loading={isProcessing}
              className="w-full bg-bg-primary-dark2 hover:bg-bg-primary-dark2/90"
              size="lg"
            >
              {isProcessing
                ? "Processing..."
                : `Pay ${formatPrice(eventDetails.price)}`}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By proceeding, you agree to our terms and conditions. Your payment
              will be processed securely through Paystack.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
