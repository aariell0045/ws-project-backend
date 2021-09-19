function phoneFormater(phone) {
	if (typeof phone === "number") {
		phone = JSON.stringify(phone);
	}


	if (!phone) {
		return { phone: undefined, properNumber: false };
	}

	phone = phone.replace(/[&/\\#,-/ /]/g, "");
	if (phone[0] === "5") {
		phone = phone.replace("5", "+9725");
	} else if (phone[0] === "0") {
		phone = phone.replace("0", "+972");
	} else if (
					phone[0] === "+" &&
					phone[1] === "9" &&
					phone[2] === "7" &&
					phone[3] === "2" &&
					phone[4] === "0"
	)
	{
		phone = phone.replace("+9720", "+972");
	} else if (phone[0] === "9" && phone[1] === "7" && phone[2] === "2" && phone[3] === "0") {
		phone = phone.replace("9720", "+972");
	} else if (phone[0] === "9" && phone[1] === "7" && phone[2] === "2") {
		phone = phone.replace("972", "+972");
	}
	phone = phone.substring(0, 4) + " " + phone.substring(4, phone.length);
	phone = phone.substring(0, 7) + "-" + phone.substring(7, phone.length);
	phone = phone.substring(0, 11) + "-" + phone.substring(11, phone.length);

	if (phone.length === 16 && phone[5] === "5") {
		return { phone, properNumber: true };
	} else {
		return { phone, properNumber: false };
	}
}

const helperFunctions = { phoneFormater };

module.exports = helperFunctions;