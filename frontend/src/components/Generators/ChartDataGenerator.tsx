const generateData1 = (a: number, b: number, maxDay: number, cols: [string, string]): (string | number)[][] => {
    const days = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 30, 60, 90, 180, 365]
        .filter((day) => day <= maxDay);

    const data = days.map((day) => [
        day.toString(),
        day === 0 ? 100 : parseFloat((a * Math.pow(day, b)).toFixed(4))*100,
    ]);
    return [cols, ...data];
};

const generateData2 = (a: number, b: number, maxDay: number, cols: [string, string]): (string | number)[][] => {
    const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 30, 60, 90, 180, 365]
        .filter((day) => day <= maxDay);

    const data = days.map((day) => [
        day.toString(),
        day === 0 ? 1 : parseFloat((a * Math.pow(day, b)).toFixed(4)),
    ]);
    return [cols, ...data];
};

const generateData3 = (a: number, b: number, maxDay: number, cols: [string, string]): (string | number)[][] => {
    const days = [7, 14, 30, 60, 90, 180, 365, maxDay]
        .filter((day) => day < maxDay);

    const data = days.map((day) => [
        day.toString(),
        day === 0 ? 100 : parseFloat((a * Math.pow(day, b)).toFixed(4))*100,
    ]);
    return [cols, ...data];
};

const generateData4 = (actualRoas7d: number, maxDay: number, cols: [string, string]): (string | number)[][] => {
    const days = [maxDay]
        .filter((day) => day <= maxDay);
    console.log(maxDay, actualRoas7d)
    const data = days.map((day) => [
        day.toString(),
        actualRoas7d*100,
    ]);
    return [cols, ...data];
};


export { generateData1, generateData2, generateData3, generateData4 };
