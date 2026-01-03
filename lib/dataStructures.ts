// Array Data Structure Implementation
export class FlightArray {
    private flights: Flight[];

    constructor() {
        this.flights = [];
    }

    // O(1) - Access by index
    get(index: number): Flight | undefined {
        return this.flights[index];
    }

    // O(1) - Add to end
    push(flight: Flight): number {
        return this.flights.push(flight);
    }

    // O(n) - Insert at index (requires shifting)
    insert(index: number, flight: Flight): void {
        this.flights.splice(index, 0, flight);
    }

    // O(n) - Remove at index (requires shifting)
    remove(index: number): Flight | undefined {
        return this.flights.splice(index, 1)[0];
    }

    // O(n) - Search
    find(flightNumber: string): Flight | undefined {
        return this.flights.find(f => f.flightNumber === flightNumber);
    }

    getAll(): Flight[] {
        return [...this.flights];
    }

    size(): number {
        return this.flights.length;
    }
}

// Linked List Node
export class ListNode<T> {
    data: T;
    next: ListNode<T> | null;
    prev: ListNode<T> | null;

    constructor(data: T) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

// Doubly Linked List for Passengers
export class PassengerList {
    private head: ListNode<Passenger> | null;
    private tail: ListNode<Passenger> | null;
    private count: number;

    constructor() {
        this.head = null;
        this.tail = null;
        this.count = 0;
    }

    // O(1) - Add to front
    addFirst(passenger: Passenger): void {
        const newNode = new ListNode(passenger);

        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }

        this.count++;
    }

    // O(1) - Add to end
    addLast(passenger: Passenger): void {
        const newNode = new ListNode(passenger);

        if (!this.tail) {
            this.head = this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            this.tail.next = newNode;
            this.tail = newNode;
        }

        this.count++;
    }

    // O(1) - Remove from front
    removeFirst(): Passenger | null {
        if (!this.head) return null;

        const data = this.head.data;
        this.head = this.head.next;

        if (this.head) {
            this.head.prev = null;
        } else {
            this.tail = null;
        }

        this.count--;
        return data;
    }

    // O(n) - Remove specific passenger
    remove(passengerId: string): boolean {
        let current = this.head;

        while (current) {
            if (current.data.id === passengerId) {
                if (current.prev) {
                    current.prev.next = current.next;
                } else {
                    this.head = current.next;
                }

                if (current.next) {
                    current.next.prev = current.prev;
                } else {
                    this.tail = current.prev;
                }

                this.count--;
                return true;
            }
            current = current.next;
        }

        return false;
    }

    toArray(): Passenger[] {
        const result: Passenger[] = [];
        let current = this.head;

        while (current) {
            result.push(current.data);
            current = current.next;
        }

        return result;
    }

    size(): number {
        return this.count;
    }
}

// Stack for Operation History
export class OperationStack<T> {
    private items: T[];

    constructor() {
        this.items = [];
    }

    // O(1) - Push
    push(item: T): void {
        this.items.push(item);
    }

    // O(1) - Pop
    pop(): T | undefined {
        return this.items.pop();
    }

    // O(1) - Peek
    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }

    toArray(): T[] {
        return [...this.items];
    }
}

// Queue for Boarding
export class BoardingQueue<T> {
    private items: T[];

    constructor() {
        this.items = [];
    }

    // O(1) - Enqueue
    enqueue(item: T): void {
        this.items.push(item);
    }

    // O(n) - Dequeue (array shift is O(n))
    // In real implementation, would use circular buffer
    dequeue(): T | undefined {
        return this.items.shift();
    }

    // O(1) - Front
    front(): T | undefined {
        return this.items[0];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }

    toArray(): T[] {
        return [...this.items];
    }
}

// Binary Tree Node
export class TreeNode<T> {
    data: T;
    left: TreeNode<T> | null;
    right: TreeNode<T> | null;

    constructor(data: T) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

// Binary Search Tree for Routes
export class RouteTree {
    root: TreeNode<Route> | null;

    constructor() {
        this.root = null;
    }

    // O(log n) average - Insert
    insert(route: Route): void {
        this.root = this.insertNode(this.root, route);
    }

    private insertNode(node: TreeNode<Route> | null, route: Route): TreeNode<Route> {
        if (!node) {
            return new TreeNode(route);
        }

        if (route.code < node.data.code) {
            node.left = this.insertNode(node.left, route);
        } else if (route.code > node.data.code) {
            node.right = this.insertNode(node.right, route);
        }

        return node;
    }

    // O(log n) average - Search
    search(code: string): Route | null {
        return this.searchNode(this.root, code);
    }

    private searchNode(node: TreeNode<Route> | null, code: string): Route | null {
        if (!node) return null;

        if (code === node.data.code) return node.data;
        if (code < node.data.code) return this.searchNode(node.left, code);
        return this.searchNode(node.right, code);
    }

    // Traversals
    inorder(): Route[] {
        const result: Route[] = [];
        this.inorderTraversal(this.root, result);
        return result;
    }

    private inorderTraversal(node: TreeNode<Route> | null, result: Route[]): void {
        if (node) {
            this.inorderTraversal(node.left, result);
            result.push(node.data);
            this.inorderTraversal(node.right, result);
        }
    }
}

// HashMap for Seat Booking
export class SeatHashMap {
    private buckets: Map<string, Booking>[];
    private size: number;

    constructor(size: number = 16) {
        this.size = size;
        this.buckets = Array.from({ length: size }, () => new Map());
    }

    // Hash function
    private hash(key: string): number {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash << 5) - hash + key.charCodeAt(i);
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash) % this.size;
    }

    // O(1) average - Set
    set(key: string, booking: Booking): void {
        const index = this.hash(key);
        this.buckets[index].set(key, booking);
    }

    // O(1) average - Get
    get(key: string): Booking | undefined {
        const index = this.hash(key);
        return this.buckets[index].get(key);
    }

    // O(1) average - Delete
    delete(key: string): boolean {
        const index = this.hash(key);
        return this.buckets[index].delete(key);
    }

    // Get all bookings
    getAll(): Booking[] {
        const result: Booking[] = [];
        for (const bucket of this.buckets) {
            result.push(...bucket.values());
        }
        return result;
    }

    // Get bucket info for visualization
    getBuckets(): Map<string, Booking>[] {
        return this.buckets;
    }
}

// Type Definitions
export interface Flight {
    id: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    status: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled';
    capacity: number;
}

export interface Passenger {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface Booking {
    id: string;
    passengerId: string;
    flightId: string;
    seatNumber: string;
    status: 'confirmed' | 'checked-in' | 'cancelled';
}

export interface Route {
    code: string;
    name: string;
    city: string;
    country: string;
}

export interface Operation {
    id: string;
    type: string;
    dataStructure: string;
    operation: string;
    timestamp: Date;
    payload: Record<string, unknown>;
    timeComplexity: string;
    spaceComplexity: string;
}
