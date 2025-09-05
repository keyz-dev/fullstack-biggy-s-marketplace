import { AuthProvider, ProductProvider, CategoryProvider, CartProvider, FavoritesProvider, OrderProvider, ApplicationProvider, NotificationProvider } from "./contexts";
import { DeliveryAgentApplicationProvider } from "./contexts/DeliveryAgentApplicationContext";

import React from 'react'

const AppProviders = ({children}) => (
    <AuthProvider>
        <NotificationProvider>
            <ApplicationProvider>
                <DeliveryAgentApplicationProvider>
                    <ProductProvider>
                        <CategoryProvider>
                            <CartProvider>
                                <FavoritesProvider>
                                    <OrderProvider>
                                        {children}
                                    </OrderProvider>
                                </FavoritesProvider>
                            </CartProvider>
                        </CategoryProvider>
                    </ProductProvider>
                </DeliveryAgentApplicationProvider>
            </ApplicationProvider>
        </NotificationProvider>
    </AuthProvider>
)

export default AppProviders
