import productModel from '../models/productModel.js';
import orderModel from '../models/orderModel.js';

// Get admin dashboard statistics
const getAdminStats = async (req, res) => {
    try {
        // Get total products count
        const totalProducts = await productModel.countDocuments({});
        
        // Get total orders count
        const totalOrders = await orderModel.countDocuments({});
        
        // Get pending orders count (orders with status other than 'Delivered')
        const pendingOrders = await orderModel.countDocuments({
            status: { $ne: 'Delivered' }
        });
        
        // Calculate total revenue from all orders
        const orders = await orderModel.find({});
        const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
        
        // Get recent orders for activity feed
        const recentOrders = await orderModel.find({})
            .sort({ date: -1 })
            .limit(5)
            .populate('userId', 'name email');
        
        // Get recent products added
        const recentProducts = await productModel.find({})
            .sort({ date: -1 })
            .limit(3);
        
        // Format recent activity
        const recentActivity = [];
        
        // Add recent orders to activity
        recentOrders.forEach(order => {
            recentActivity.push({
                type: 'order',
                title: 'New order received',
                description: `Order #${order._id.toString().slice(-6)} - $${order.amount}`,
                timestamp: order.date,
                status: order.status,
                orderId: order._id
            });
        });
        
        // Add recent products to activity
        recentProducts.forEach(product => {
            recentActivity.push({
                type: 'product',
                title: 'Product added',
                description: `New product "${product.name}" added to catalog`,
                timestamp: product.date,
                productId: product._id
            });
        });
        
        // Sort activity by timestamp (most recent first)
        recentActivity.sort((a, b) => b.timestamp - a.timestamp);
        
        res.json({
            success: true,
            stats: {
                totalProducts,
                totalOrders,
                pendingOrders,
                totalRevenue
            },
            recentActivity: recentActivity.slice(0, 5) // Return top 5 activities
        });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get detailed analytics for charts
const getAnalytics = async (req, res) => {
    try {
        const { period = '7d' } = req.query; // 7d, 30d, 90d
        
        let startDate;
        const now = Date.now();
        
        switch (period) {
            case '7d':
                startDate = now - (7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = now - (30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = now - (90 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = now - (7 * 24 * 60 * 60 * 1000);
        }
        
        // Get orders in the specified period
        const orders = await orderModel.find({
            date: { $gte: startDate }
        }).sort({ date: 1 });
        
        // Get products added in the specified period
        const products = await productModel.find({
            date: { $gte: startDate }
        }).sort({ date: 1 });
        
        // Group orders by date for chart data
        const orderData = {};
        orders.forEach(order => {
            const date = new Date(order.date).toLocaleDateString();
            if (!orderData[date]) {
                orderData[date] = { orders: 0, revenue: 0 };
            }
            orderData[date].orders += 1;
            orderData[date].revenue += order.amount;
        });
        
        // Group products by date
        const productData = {};
        products.forEach(product => {
            const date = new Date(product.date).toLocaleDateString();
            if (!productData[date]) {
                productData[date] = 0;
            }
            productData[date] += 1;
        });
        
        res.json({
            success: true,
            analytics: {
                orderData,
                productData,
                period
            }
        });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { getAdminStats, getAnalytics }; 