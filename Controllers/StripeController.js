const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');
const Stripe = require('stripe')
const stripe = new Stripe('sk_test_51NlPJfB5gojcRHJMwcJRPwkur3ZosgOHmPgjqwkC4MLiQDC4altW3Sji476gsNUOuIoyJpH9yDMc0bwSwr1ePQEd00hc2TkGQe')

module.exports = {
    async createPayment(req,res){
        const data = req.body;
        const order = data.order;
        try {
            const payment = await stripe.paymentIntents.create({
                amount: data.amount,
                currency:'usd',
                description:'ECOMERCE DELIVERY REACT APP',
                payment_method:data.id, //token
                payment_method_types: ['card'],
                confirm:true,
                return_url: 'https://dashboard.stripe.com/test/payments',
               
            })
            console.log('Payment' + JSON.stringify(payment, null,3))

            if(payment !==null && payment !== undefined){
                if(payment.status === 'succeeded'){
                    Order.create(order, async (err, id) => {

                        if (err) {
                            return res.status(501).json({
                                success: false,
                                message: 'Hubo un error al momento de crear la orden',
                                error: err
                            });
                        }
            
                        for (const product of order.products) {
                            await OrderHasProducts.create(id, product.id, product.quantity, (err, id_data) => {
                                if (err) {
                                    return res.status(501).json({
                                        success: false,
                                        message: 'Hubo un error con la creacion de los productos en la orden',
                                        error: err
                                    });
                                }
                            });
                        }
            
                        return res.status(201).json({
                            success: true,
                            message: 'Transacción exitosa',
                            data: `${id}` // EL ID DE LA NUEVA ORDER
                        });
            
                    });
                }
                else{
                    return res.status(200).json({
                        success: true,
                        message: 'No se pudo efectuar la transacción'
                    })
                }
            }
            else{
                return res.status(200).json({
                    success: true,
                    message: 'No se pudo efectuar la transacción'
            })
            }
        } catch (error) {
            console.log('Error stripe' + error)
            return res.status(501).json({
                success: false,
                message: 'error en transacción ',
                error: error
            })
            
        }
    }
}