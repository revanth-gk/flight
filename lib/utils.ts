export const generateId = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const generateFlightNumber = (): string => {
    const airlines = ['AI', 'UK', '6E', 'SG', 'G8'];
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `${airline}${number}`;
};

export const generateSeatNumber = (): string => {
    const rows = Math.floor(Math.random() * 30) + 1;
    const seats = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seat = seats[Math.floor(Math.random() * seats.length)];
    return `${rows}${seat}`;
};

export const airportCodes = [
    { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', country: 'India' },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', country: 'India' },
    { code: 'BLR', name: 'Kempegowda International', city: 'Bangalore', country: 'India' },
    { code: 'MAA', name: 'Chennai International', city: 'Chennai', country: 'India' },
    { code: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', country: 'India' },
    { code: 'CCU', name: 'Netaji Subhas Chandra Bose International', city: 'Kolkata', country: 'India' },
    { code: 'GOI', name: 'Goa International', city: 'Goa', country: 'India' },
    { code: 'COK', name: 'Cochin International', city: 'Kochi', country: 'India' },
    { code: 'AMD', name: 'Sardar Vallabhbhai Patel International', city: 'Ahmedabad', country: 'India' },
    { code: 'PNQ', name: 'Pune Airport', city: 'Pune', country: 'India' },
];

export const passengerNames = [
    'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh',
    'Ananya Iyer', 'Rohan Gupta', 'Kavya Nair', 'Arjun Desai', 'Isha Mehta',
    'Aditya Verma', 'Diya Kapoor', 'Karan Malhotra', 'Riya Joshi', 'Siddharth Rao'
];

export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const getRandomAirport = (): typeof airportCodes[0] => {
    return airportCodes[Math.floor(Math.random() * airportCodes.length)];
};

export const getRandomName = (): string => {
    return passengerNames[Math.floor(Math.random() * passengerNames.length)];
};

export const generateEmail = (name: string): string => {
    const cleanName = name.toLowerCase().replace(' ', '.');
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${cleanName}@${domain}`;
};

export const generatePhone = (): string => {
    return `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`;
};

export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const complexityColor = (complexity: string): string => {
    if (complexity.includes('1')) return '#38ef7d'; // O(1) - Green
    if (complexity.includes('log')) return '#f2c94c'; // O(log n) - Yellow
    if (complexity.includes('n²') || complexity.includes('n^2')) return '#f45c43'; // O(n²) - Red
    return '#667eea'; // O(n) - Purple
};

export const statusColor = (status: string): string => {
    const colors: Record<string, string> = {
        'scheduled': '#667eea',
        'boarding': '#f2c94c',
        'departed': '#11998e',
        'arrived': '#38ef7d',
        'cancelled': '#f45c43',
        'confirmed': '#38ef7d',
        'checked-in': '#11998e',
    };
    return colors[status] || '#94a3b8';
};
