import Swal from "sweetalert2";

export const clearCart = (
  setCart: React.Dispatch<React.SetStateAction<any[]>>,
  setSelectReturnSale: React.Dispatch<React.SetStateAction<number>>,
  setShippingCost: React.Dispatch<React.SetStateAction<number>>
) => {
  Swal.fire({
    title: "আপনি কি নিশ্চিত?",
    text: "কার্টে থাকা সব পণ্য মুছে যাবে!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "হ্যাঁ, পরিষ্কার করুন!",
    cancelButtonText: "না, বাতিল করুন",
  }).then((result) => {
    if (result.isConfirmed) {
      setCart([]);
      setSelectReturnSale(0);
      setShippingCost(0);

      Swal.fire({
        icon: "success",
        title: "পরিষ্কার!",
        text: "কার্ট খালি করা হয়েছে।",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
    }
  });
};
