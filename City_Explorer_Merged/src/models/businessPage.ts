import mongoose, { Document, Schema, Types } from 'mongoose';

interface Item {
    name: string;
    description: string;
    price: string;
    image: string;
}
export interface Items {
    name: string;
    description: string;
    price: string;
    image: string;
}

interface Event {
    title: string;
    description: string;
    date: string;
    venue: string;
    image?: string;
}
 
export interface BusinessEvent {
    title: string;
    description: string;
    venue: string;
    date: string;
}


interface Promo {
    _id: string;
    name: string;
    description: string;
    timeValid: string;
}

export interface PromoDeal {
    _id: string;
    name: string;
    description: string;
    timeValid: string;
}

interface Hours {
    day: string;
    time: string;
}

interface Business extends Document {
    name: string;
    description: string;
    category: string;
    logo: string;
    items: Item[];
    events: Event[];
    promo: Promo[];
    location: string;
    openHours: Hours[];
    phone: string;
    email: string;
    password: string;
    website: string; 
    role: string;

}

const itemSchema = new Schema<Item>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true }
});

const eventSchema = new Schema<Event>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    venue: { type: String, required: true },
    image: { type: String }
});

const promoSchema = new Schema<Promo>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    timeValid: { type: String, required: true },
})

const hoursSchema = new Schema<Hours>({
    day: { type: String, required: true },
    time: { type: String, required: true },
   
});

const businessSchema = new Schema<Business>({
    name: { type: String},
    category: { type: String},
    logo: { type: String},
    email: {type:String, required: true },
    phone: { type: String},
    items: { type: [itemSchema], default: [] },
    events: { type: [eventSchema], default: []},
    promo: { type: [promoSchema], default: [] },
    password: { type: String, required: true},
    role: { type: String, enum: ['user', 'business'], default: 'business' },
    location: { type: String},
    openHours: { type: [hoursSchema], default: []},
    website: { type: String }, 
    description: { type: String}
});

const BusinessModel = mongoose.model<Business>('Business', businessSchema);

export default BusinessModel;