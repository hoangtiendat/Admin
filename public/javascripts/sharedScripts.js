$( document ).ready(function() {
    Dropzone.autoDiscover = false;
    const blockMsg = ["Mở khóa", "Khóa TK"];
    const statusMsg = ["Khóa", "Hoạt động"];
    const statusMsgColor = ["#D44638", "#3c763d"];
    const urlImageSeperator = ", ";
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
    const $productDetailId = $('#product-id');
    let productNumOfImages = 0;
    let removedImages = [];
    $('#product-upload-image').dropzone({
        url: "/product/uploadImage",
        method: "POST",
        timeout: 5 * 60,
        uploadMultiple: true,
        paramName:  function(n) { return "images";},
        dictDefaultMessage: "Kéo ảnh sản phẩm vào",
        acceptedFiles: "image/*",
        addRemoveLinks: true,
        dictRemoveFile: "Xóa",
        autoProcessQueue: false,
        init: function () {
            let myDropzone = this;
            let urls = $('#product-image-urls').val() || "";
            urls = urls.split(urlImageSeperator);
            productNumOfImages = urls.length;
            for (let i = 0; i < urls.length; i++){
                const mockFile = {
                    name: urls[i].slice(urls[i].lastIndexOf("/") + 1),
                    size: 1234,
                    type: "image/jpeg",
                    status: Dropzone.ADDED,
                    url: urls[i],
                    accepted: true,
                    index: i + 1
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
            formData.append("productId", parseInt($productDetailId.val()));
            formData.append("numOfImages", productNumOfImages);
            formData.append("removedImages", removedImages.join(urlImageSeperator));
        }
    });
    $('#product-upload-image-btn').on('click', (e) => {
        e.preventDefault();
        const dropzone = Dropzone.forElement('#product-upload-image');
        dropzone.processQueue();
    })
});
