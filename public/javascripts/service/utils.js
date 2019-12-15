const Alert = new SweetAlert();
function SweetAlert() {
    const timer = 5 * 60 * 1000;
    this.warning = (message, options) => {
        return Swal.fire({
            title: "<span style='color: #ff6600;'>Thông báo</span>",
            icon: "warning",
            text: message + "!",
            timer: timer,
            showCloseButton: true,
            confirmButtonText: "Đồng ý",
            confirmButtonColor: "#00c300",
            showCancelButton: true,
            cancelButtonColor: "#ea4335",
            cancelButtonText: "Hủy bỏ",
            focusCancel: true,
        });
    }
    this.success = (message, options) => {
        return Swal.fire({
            title: "<span style='color: #00c300;'>Thông báo</span>",
            icon: "success",
            text: message + "!",
            timer: timer,
            showCloseButton: true,
            confirmButtonText: "Đồng ý",
            confirmButtonColor: "#00c300",
            focusConfirm: true,
        });
    }
    this.error = (message, options) => {
        return Swal.fire({
            title: "<span style='color: #ea4335;'>Thông báo</span>",
            icon: "error",
            text: message + "!",
            timer: timer,
            showCloseButton: true,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonColor: "#ea4335",
            cancelButtonText: "Đồng ý",
            focusCancel: true,
        });
    }
}
