import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/apiConfig';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
  }

  /**
   * Initialize socket connection with authentication
   */
  async connect() {
    try {
      // Get auth token from storage
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        console.log('No auth token found, skipping socket connection');
        return;
      }

      // Create socket connection
      this.socket = io(API_BASE_URL.replace('/api', ''), {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      this.setupEventListeners();
      
      console.log('🔌 Socket connection initiated');
    } catch (error) {
      console.error('❌ Socket connection error:', error);
    }
  }

  /**
   * Setup socket event listeners
   */
  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      this.isConnected = false;
      
      // Attempt reconnection for certain disconnect reasons
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't reconnect
        return;
      }
      
      this.handleReconnection();
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      this.isConnected = false;
      this.handleReconnection();
    });

    // Authentication events
    this.socket.on('room-joined', (data) => {
      console.log('🏠 Joined room:', data);
    });

    // Notification events
    this.socket.on('notification:new', (data) => {
      console.log('🔔 New notification received:', data);
      this.handleNewNotification(data);
    });

    this.socket.on('delivery-status-update', (data) => {
      console.log('📦 Delivery status update:', data);
      this.handleDeliveryStatusUpdate(data);
    });

    // Order events
    this.socket.on('order:update', (data) => {
      console.log('📋 Order update:', data);
      this.handleOrderUpdate(data);
    });

    // Payment events
    this.socket.on('payment:update', (data) => {
      console.log('💳 Payment update:', data);
      this.handlePaymentUpdate(data);
    });
  }

  /**
   * Handle reconnection logic
   */
  handleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Join user-specific room
   */
  joinUserRoom(userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-user-room', { userId });
    }
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(notificationId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('notification:read', { notificationId });
    }
  }

  /**
   * Handle new notification
   */
  handleNewNotification(data) {
    // This will be handled by the notification context
    if (this.onNotificationReceived) {
      this.onNotificationReceived(data);
    }
  }

  /**
   * Handle delivery status update
   */
  handleDeliveryStatusUpdate(data) {
    if (this.onDeliveryStatusUpdate) {
      this.onDeliveryStatusUpdate(data);
    }
  }

  /**
   * Handle order update
   */
  handleOrderUpdate(data) {
    if (this.onOrderUpdate) {
      this.onOrderUpdate(data);
    }
  }

  /**
   * Handle payment update
   */
  handlePaymentUpdate(data) {
    if (this.onPaymentUpdate) {
      this.onPaymentUpdate(data);
    }
  }

  /**
   * Set notification callback
   */
  setNotificationCallback(callback) {
    this.onNotificationReceived = callback;
  }

  /**
   * Set delivery status update callback
   */
  setDeliveryStatusCallback(callback) {
    this.onDeliveryStatusUpdate = callback;
  }

  /**
   * Set order update callback
   */
  setOrderUpdateCallback(callback) {
    this.onOrderUpdate = callback;
  }

  /**
   * Set payment update callback
   */
  setPaymentUpdateCallback(callback) {
    this.onPaymentUpdate = callback;
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 Socket disconnected manually');
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id || null,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Export singleton instance
export default new SocketService();
