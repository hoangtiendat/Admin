$( document ).ready(function() {
    const blockMsg = ["Mở khóa", "Khóa TK"];
    const statusMsg = ["Khóa", "Hoạt động"];
    const statusMsgColor = ["#D44638", "#3c763d"];
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
});
