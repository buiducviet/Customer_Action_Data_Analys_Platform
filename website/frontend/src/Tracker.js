import { trackSelfDescribingEvent, newTracker, trackPageView, setUserId, addGlobalContexts, removeGlobalContexts } from '@snowplow/browser-tracker';
import {
    SnowplowEcommercePlugin, trackProductView
} from '@snowplow/browser-plugin-snowplow-ecommerce';

function ViewProduct(name, price, id, category, userId) {
    trackSelfDescribingEvent({
        event: {
            schema: 'iglu:nana.shop/product_action/jsonschema/1-0-0',
            data: {
                action: 'view',
                productId: id,
                userId: userId,
                timestamp: new Date().toISOString(),
            },
        },
        context: [
            {
                schema: 'iglu:nana.shop/product_entity/jsonschema/1-0-0',
                data: {
                    name: name,
                    price: price,
                    id: id,
                    category: category
                }
            }
        ],
    });
    // trackPageView()
    // TrackProductView(name, price, id, category)
}

function TrackProductView(name, price, id, category) {
    trackProductView({
        id: id,
        name: name,
        price: price,
        category: category,
        currency: "VND"
    })
}

function AddProduct(name, price, id, category, variant, qty, userId) {
    console.log("productttttttt: " + name + " " + price + " " + id + " " + category + " " + variant + " " + qty);
    trackSelfDescribingEvent({
        event: {
            schema: "iglu:nana.shop/product_action/jsonschema/1-0-0",
            data: {
                action: 'add_to_cart',
                productId: id,
                userId: userId,
                timestamp: new Date().toISOString(),
            }
        },
        context: [
            {
                schema: 'iglu:nana.shop/product_entity/jsonschema/1-0-0',
                data: {
                    id: id,
                    name: name,
                    price: price,
                    currency: "VND",
                    quantity: qty,
                    category: category,
                    size: variant
                }
            }
        ]
    })
}

function RemoveProduct(name, price, id, category, variant, qty, userId) {
    console.log("productttttttt: " + name + " " + price + " " + id + " " + category + " " + variant + " " + qty);
    trackSelfDescribingEvent({
        event: {
            schema: "iglu:nana.shop/product_action/jsonschema/1-0-0",
            data: {
                action: 'remove_from_cart',
                productId: id,
                userId: userId,
                timestamp: new Date().toISOString(),
            }
        },
        context: [
            {
                schema: 'iglu:nana.shop/product_entity/jsonschema/1-0-0',
                data: {
                    id: id,
                    name: name,
                    price: price,
                    currency: "VND",
                    quantity: qty,
                    category: category,
                    size: variant
                }
            }
        ]
    })
}

function PurchaseProduct(items, userId) {
    var contexts = []
    // console.log(items);
    items.forEach(item => {
        var product = {
            schema: 'iglu:nana.shop/product_entity/jsonschema/1-0-0',
            data: {
                id: String(item.productId),
                name: String(item.name),
                price: Number(item.price),
                currency: "VND",
                quantity: Number(item.quantity),
                size: String(item.variantStorage),
                category: String(item.category)
            }
        }
        contexts.push(product)
    });

    trackSelfDescribingEvent({
        event: {
            schema: "iglu:nana.shop/product_action/jsonschema/1-0-0",
            data: {
                action: 'purchase',
                productId: "none",
                userId: userId,
                timestamp: new Date().toISOString(),
            }
        },
        context: contexts
    })
}

function CreatNewTracker(userId, role) {
    newTracker('tracking_product', 'localhost:9090', {
        appId: 'ecomerceshop',
        plugins: [SnowplowEcommercePlugin()],
        discoverRootDomain: true,
        cookieSameSite: 'Lax', // Recommended
        contexts: {
            webPage: true // default, can be omitted
        }
    });
    console.log("userId " + userId);
    if ( userId != '2' && userId != '4' && userId != '3' && role != 'admin')
    {
        if(userId ==undefined || userId == 'undefined')
        {
            userId = 'guest_' + Date.now();
        }
        trackSelfDescribingEvent({
            event: {
                schema: "iglu:nana.shop/app_action/jsonschema/1-0-0",
                data: {
                    action: "view_page",
                    userId: userId,
                    timestamp: new Date().toISOString()
                }
            }
        });

    }
}

function TrackPageView() {
    trackPageView()
}

function SetEmailUser(email) {
    setUserId(email)
}

function AddUserContext(id, name, phone, email) {
    console.log("user id : " + id);
    let user_context = {
        schema: "iglu:nana.shop/user_context/jsonschema/1-0-0",
        data: {
            user_id: String(id),
            user_name: String(name),
            phone_number: String(phone),
            email: String(email)
        }

    }

    addGlobalContexts([user_context])
}

function RemoveUserContext(id, name, phone, email) {

    let user_context = {
        schema: "iglu:nana.shop/user_context/jsonschema/1-0-0",
        data: {
            user_id: String(id),
            user_name: String(name),
            phone_number: String(phone),
            email: String(email)
        }

    }

    removeGlobalContexts([user_context])
}

export { ViewProduct, AddProduct, CreatNewTracker, PurchaseProduct, RemoveProduct, TrackPageView, TrackProductView, SetEmailUser, AddUserContext, RemoveUserContext };