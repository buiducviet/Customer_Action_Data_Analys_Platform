export const formatNumber = (number) => {
    // Nếu là dạng số thực (chuỗi hoặc số), chuyển thành dạng 34.560.000đ
    if (typeof number === "string" && number.includes(".")) {
        const [mil, hun] = number.split(".");
        return `${mil}.${hun.padEnd(3, "0")}.000`;
    }
    if (typeof number === "number" && !Number.isInteger(number)) {
        const [mil, hun] = number.toFixed(3).split(".");
        return `${mil}.${hun}.000`;
    }
    // Nếu là số nguyên, chuyển thành dạng xx.000.000đ
    if (typeof number === "string") number = Number(number);
    if (Number.isInteger(number)) {
        return `${number}.000.000`;
    }
    return number;
};
