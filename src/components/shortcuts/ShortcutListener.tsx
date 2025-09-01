import { useNavigate } from "react-router-dom";
import usePOSShortcuts from "../../hooks/usePOSShortcuts";
import { ShortcutAction } from "../../utils/shortcutConfig";



export default function ShortcutListener() {
    const navigate = useNavigate();
    
   

  const actions: Partial<Record<ShortcutAction, () => void>> = {
    searchProduct: () => {
      window.dispatchEvent(new Event("focusProductSearch")); 
    },
    newOrderTab: () => navigate("/retailSale"),
    todayOrderTab: () => alert("📅 Today Order Tab"),
    placeOrder: () => alert("✅ Place Order"),
    selectCustomerType: () => alert("👤 Select Customer Type"),
    editServiceCharge: () => alert("💰 Edit Service Charge"),
    selectTable: () => alert("🍽️ Select Table"),
    searchTodayOrder: () => alert("🔎 Search Today Order"),
    updateSelectCustomerType: () => alert("♻️ Update Select Customer Type"),
    updateServiceCharge: () => alert("♻️ Update Service Charge"),
    updateSubmitForm: () => alert("📤 Update Submit Form"),
    payAndPrintBill: () => alert("🖨️ Pay & Print Bill"),

    onGoingTab: () => alert("🔄 On Going Tab"),
    onlineOrderTab: () => alert("🌐 Online Order Tab"),
    quickOrder: () => alert("⚡ Quick Order"),
    selectCustomer: () => alert("👥 Select Customer"),
    editDiscount: () => alert("💸 Edit Discount"),
    selectWaiter: () => alert("🙋 Select Waiter"),
    cookingTime: () => alert("⏱️ Cooking Time"),
    goEdit: () => alert("✏️ Go Edit"),
    searchOnlineOrder: () => alert("🔍 Search Online Order"),
    updateSelectedCustomer: () => alert("♻️ Update Selected Customer"),
    updateDiscount: () => alert("♻️ Update Discount"),
    updateSelectTable: () => alert("♻️ Update Select Table"),
    selectPaymentType: () => alert("💳 Select Payment Type"),
    paidAmountTyping: () => alert("💵 Paid Amount Typing"),
  };

  usePOSShortcuts(actions);

  return null;
}
