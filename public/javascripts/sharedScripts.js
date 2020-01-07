$( document ).ready(function() {
    Dropzone.autoDiscover = false;
    const blockMsg = ["Mở khóa", "Khóa TK"];
    const statusMsg = ["Khóa", "Hoạt động"];
    const statusMsgColor = ["#D44638", "#3c763d"];
    const urlImageSeperator = ", ";
    const $imageUploadError = $('#image-upload-error');
    $('.set-status-btn').on('click', async (e) => {
        const $this = $(e.target);
        const userId = $this.attr('data-userId');
        const isActive = parseInt($this.attr('data-isActive'));
        Alert.warning("Bạn có chắc muốn " + blockMsg[isActive] + " người dùng này không")
            .then(async (result) => {
                if (result.value){
                    const result = await setUserStatusDB(userId, isActive ^ 1);
                    if (result.isSuccess){
                        Alert.success(blockMsg[isActive] + " tài khoản thành công !!!");
                        setStatusBtnStyle($this, userId, isActive ^ 1);
                    } else {
                        Alert.error(blockMsg[isActive] + " tài khoản thất bại !!!");
                    }
                }
            })
    })
    $('.set-status-bill-btn').on('click', async (e) => {
        const $this = $(e.target);
        const billId = $this.attr('data-billId');
        const status = $this.attr('data-status');

        Alert.warning("Bạn có muốn chuyển qua trạng thái " + status)
            .then(async (result) => {
                if (result.value){
                    const result = await setBillStatusDB(billId, status);
                    if (result.isSuccess){
                        Alert.success(" Đổi trạng thái thành công !!!");
                        setBillStatusBtnStyle($this, billId, status);
                    } else {
                        Alert.error(" Đổi trạng thái thất bại !!!");
                    }
                }
            })
    })
    function setUserStatusDB(userId, isActive){
        showLoading();
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/user/setStatus",
                type: "POST",
                dataType: "json",
                data: {
                    userId: userId,
                    isActive: isActive
                },
                success: (result) => {
                    resolve(result);
                },
                error: (err) => {
                    reject(err);
                },
                complete: () => {
                    hideLoading();
                }

            })
        })
    }

    function setBillStatusDB(billId, status){
        showLoading();
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/bill/setStatus",
                type: "POST",
                dataType: "json",
                data: {
                    billId: billId,
                    status: status
                },
                success: (result) => {
                    resolve(result);
                },
                error: (err) => {
                    reject(err);
                },
                complete: () => {
                    hideLoading();
                }

            })
        })
    }

    function setStatusBtnStyle($button, userId, isActive){
        if (isActive){
            $button.removeClass("btn-success");
            $button.addClass("btn-danger");
        } else {
            $button.addClass("btn-success");
            $button.removeClass("btn-danger");
        }
        $button.text(blockMsg[isActive]);
        $button.attr("data-isActive", isActive);

        const $statusText = $(`.status-text[data-userId=${userId}]`);
        $statusText.text(statusMsg[isActive]);
        $statusText.css('color', statusMsgColor[isActive]);
    }

    function setBillStatusBtnStyle($button, billId, status){
        const $statusText = $(`.status-text[data-billId=${billId}]`);
        $statusText.text(status);
        if (status === "Đang giao"){
            $button.removeClass("btn-warning");
            $button.addClass("btn-success");
            $button.text("Đã giao");
            $button.attr("data-status", "Đã giao");
            $statusText.removeClass("text-danger");
            $statusText.addClass("text-warning");
        } else if (status === "Đã giao"){
            $button.addClass("btn-danger");
            $button.removeClass("btn-success");
            $button.text("Chưa giao");
            $button.attr("data-status", "Chưa giao");
            $statusText.removeClass("text-warning");
            $statusText.addClass("text-success");
        } else {
            $button.removeClass("btn-danger");
            $button.addClass("btn-warning");
            $button.text("Đang giao");
            $button.attr("data-status", "Đang giao");
            $statusText.removeClass("text-success");
            $statusText.addClass("text-danger");
        }
    }

    //Edit Profile Validation
    const $editProfileForm = $(document.edit_profile_form);
    if ($editProfileForm.length > 0){
        $(document.edit_profile_form.lastName).focus();
        $editProfileForm.validate({
            rules: {
                firstName: {
                    required: true
                },
                lastName: {
                    required: true
                },
                gender: {
                    required: true
                },
                email: {
                    required: true,
                    email: true,
                },
                birthDate: {
                    required: true
                },
                phone: {
                    required: true,
                    minlength: 10
                },
                address: {
                    required: true,
                    minlength: 10
                },
                city: {
                    required: true
                }
            },
            messages: {
                firstName: {
                    required: "Chưa nhập tên"
                },
                lastName: {
                    required: "Chưa nhập họ"
                },
                gender: {
                    required: "Chưa chọn giới tính"
                },
                email: {
                    required: "Chưa nhập email",
                    email: "Email phải có dạng abc@xyz.qwe",
                },
                birthDate: {
                    required: "Chưa nhập ngày sinh"
                },
                phone: {
                    required: "Chưa nhập số điện thoại",
                    minlength: "Số điện thoại phải có tối thiểu 10 số"
                },
                address: {
                    required: "Chưa nhập địa chỉ",
                    minlength: "Địa chỉ phải có tối thiểu 10 ký tự"
                },
                city: {
                    required: "Chưa nhập tỉnh thành"
                }
            }
        });
    }
    //Product Upload Image
    const $editProductForm = $(document.edit_product_form);
    if ($editProductForm.length > 0){
        $(document.edit_product_form.name).focus();
        $editProductForm.validate({
            rules: {
                name: {
                    required: true
                },
                price: {
                    required: true,
                    number: true,
                    min: 0
                },
                discount: {
                    required: true,
                    number: true,
                    min: 0
                },
                storeId: {
                    required: true
                },
                categoryId: {
                    required: true
                },
                description: {
                    required: true,
                    maxlength: 3000
                },
                city: {
                    required: true
                }
            },
            messages: {
                name: {
                    required: "Chưa nhập tên"
                },
                price: {
                    required: "Chưa nhập giá gốc",
                    number: "Giá gốc phải có dạng số",
                    min: "Giá gốc phải lớn hơn 0"
                },
                discount: {
                    required: "Chưa nhập giả giảm",
                    number: "Giá giảm phải có dạng số",
                    min: "Giá giảm phải lớn hơn 0"
                },
                storeId: {
                    required: "Chưa chọn cửa hàng",
                },
                categoryId: {
                    required: "Chưa chọn loại sản phẩm",
                },
                description: {
                    required: "Chưa nhập mô tả sản phẩm",
                    maxlength: "Mô tả sản phẩm chỉ có tối đa 3000 ký tự",
                },
                city: {
                    required: "Chưa chọn tỉnh thành"
                }
            }
        });
    }

    const $productDetailId = $('#product-id');
    let productNumOfImages = 0;
    let removedImages = [];
    let imageUrls;
    let isSent = false;
    $('#product-upload-image').dropzone({
        url: "/product/uploadImage",
        method: "POST",
        timeout: 5 * 60 * 1000,
        uploadMultiple: true,
        paramName:  function(n) { return "images";},
        dictDefaultMessage: "Kéo ảnh sản phẩm vào",
        acceptedFiles: "image/*",
        addRemoveLinks: true,
        dictRemoveFile: "Xóa",
        autoProcessQueue: false,
        init: function () {
            let myDropzone = this;
            imageUrls = $('#product-image-urls').val() || "";
            const urls = imageUrls.split(urlImageSeperator);
            productNumOfImages = urls.length;
            for (let i = 0; i < urls.length; i++){
                const mockFile = {
                    name: urls[i].slice(urls[i].lastIndexOf("/") + 1),
                    size: 1234,
                    type: "image/jpeg",
                    status: Dropzone.ADDED,
                    url: urls[i],
                    accepted: true,
                    index: urls[i].match(/\d+(?=\D*$)/i)
                };
                myDropzone.options.addedfile.call(this, mockFile);
                myDropzone.options.thumbnail.call(this, mockFile, urls[i]);
                myDropzone.options.complete.call(this, mockFile);
                myDropzone.files.push(mockFile);

                mockFile.previewElement.classList.add('dz-success');
                mockFile.previewElement.classList.add('dz-complete');
            }

            this.on("removedfile", function (file) {
                // Only files that have been programmatically added should
                // have a url property.
                if (file.url && file.url.trim().length > 0) {
                    removedImages.push(file.index);
                }
            });
        },
        sending: (file, xhr, formData) => {
           if (!isSent){
               formData.append("productId", parseInt($productDetailId.val()));
               formData.append("imageUrls", imageUrls);
               formData.append("removedImages", removedImages.join(urlImageSeperator));
               formData.append("currentPath", window.location.pathname);
               isSent = true;
           }
        },
        success: (file, response) => {
            if (response.success){
                window.location.href = "/product_detail/" + parseInt($productDetailId.val());
            } else {
                Alert.error(response.error || "Upload ảnh thất bại !!!");
            }
        }
    });
    $('#product-upload-image-btn').on('click', (e) => {
        e.preventDefault();
        const dropzone = Dropzone.forElement('#product-upload-image');
        dropzone.processQueue();
    });

    const $addProductForm = $(document.add_product_form);
    if ($addProductForm.length > 0){
        $(document.add_product_form.name).focus();
        $addProductForm.validate({
            rules: {
                name: {
                    required: true
                },
                price: {
                    required: true,
                    number: true,
                    min: 0
                },
                discount: {
                    required: true,
                    number: true,
                    min: 0
                },
                storeId: {
                    required: true
                },
                categoryId: {
                    required: true
                },
                description: {
                    required: true,
                    maxlength: 3000
                },
                city: {
                    required: true
                }
            },
            messages: {
                name: {
                    required: "Chưa nhập tên"
                },
                price: {
                    required: "Chưa nhập giá gốc",
                    number: "Giá gốc phải có dạng số",
                    min: "Giá gốc phải lớn hơn 0"
                },
                discount: {
                    required: "Chưa nhập giả giảm",
                    number: "Giá giảm phải có dạng số",
                    min: "Giá giảm phải lớn hơn 0"
                },
                storeId: {
                    required: "Chưa chọn cửa hàng",
                },
                categoryId: {
                    required: "Chưa chọn loại sản phẩm",
                },
                description: {
                    required: "Chưa nhập mô tả sản phẩm",
                    maxlength: "Mô tả sản phẩm chỉ có tối đa 3000 ký tự",
                },
                city: {
                    required: "Chưa chọn tỉnh thành"
                }
            }
        });
    }

    $('#add-product-upload-image').dropzone({
        url: "/add_product",
        method: "POST",
        timeout: 5 * 60 * 1000,
        uploadMultiple: true,
        paramName:  function(n) { return "images";},
        dictDefaultMessage: "Kéo ảnh sản phẩm vào",
        acceptedFiles: "image/*",
        addRemoveLinks: true,
        dictRemoveFile: "Xóa",
        autoProcessQueue: false,
        sending: (file, xhr, formData) => {
            if (!isSent){
                formData.append("storeId", parseInt($(document.add_product_form.storeId).val()));
                formData.append("name", $(document.add_product_form.name).val());
                formData.append("new", $(document.add_product_form.new).is(":checked"));
                formData.append("price", Number($(document.add_product_form.price).val()));
                formData.append("discount", Number($(document.add_product_form.discount).val()));
                formData.append("categoryId", parseInt($(document.add_product_form.categoryId).val()));
                formData.append("description", $(document.add_product_form.description).val());
                isSent = true;
            }
        },
        success: (file, response) => {
            if (response.productId){
                window.location.href = "/product_detail/" + response.productId;
            } else {
                Alert.error(response.error || "Thêm sản phẩm thất bại !!!");
            }
        }
    });

    $('#add-product-btn').on('click', (e) => {
        e.preventDefault();
        let flag1 = false;
        const dropzone = Dropzone.forElement('#add-product-upload-image');
        if (dropzone.files.length > 0) {
            flag1 = true;
            showUploadImageError(false);
        } else {
            flag1 = false;
            showUploadImageError(true);
        }
        if ($addProductForm.valid() && flag1) {
            dropzone.processQueue();
        };
    });
    function showUploadImageError(flag) {
        if (flag) {
            $imageUploadError.css('display', 'block');
        } else {
            $imageUploadError.hide();
        }
    }
});
