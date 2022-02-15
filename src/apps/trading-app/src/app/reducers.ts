import { reducer as feedReducer } from '@trading/models/feed';
import { reducer as orderBookModuleReducer } from '@trading/modules/order-book';

// Add reducers here
const rootReducer = {
    ...feedReducer,
    ...orderBookModuleReducer,
};

export default rootReducer;
