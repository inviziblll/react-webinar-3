import { generateCode } from './utils';

/**
 * Хранилище состояния приложения
 */
class Store {
  constructor(initState = {}) {
    this.state = initState;
    this.listeners = []; // Слушатели изменений состояния
  }

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener) {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    };
  }

  /**
   * Выбор состояния
   * @returns {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState) {
    this.state = newState;
    // Вызываем всех слушателей
    for (const listener of this.listeners) listener();
  }

  /**
   * Добавление новой записи
   */
  addItem() {
    this.setState({
      ...this.state,
      list: [...this.state.list, { code: generateCode(), title: 'Новая запись' }],
    });
  }

  /**
   * Удаление записи по коду
   * @param code
   */
  deleteItem(code) {
    this.setState({
      ...this.state,
      // Новый список, в котором не будет удаляемой записи
      list: this.state.list.filter(item => item.code !== code),
    });
  }

  /**
   * Выделение записи по коду
   * @param code
   */
  selectItem(code) {
    this.setState({
      ...this.state,
      list: this.state.list.map(item => {
        if (item.code === code) {
          // Смена выделения и подсчёт
          return {
            ...item,
            selected: !item.selected,
            count: item.selected ? item.count : item.count + 1 || 1,
          };
        }
        // Сброс выделения если выделена
        return item.selected ? { ...item, selected: false } : item;
      }),
    });
  }


  // cart

  removeProduct(code) {
      this.setState({
        ...this.state,
        cart: this.state.cart.filter(item => item.code !== code),
      });
  }

  
  addProduct(code) {
      // console.log('addProduct');
      // console.log(code);

      console.log(this.state.cart);


      let product = this.state.list.find(item => item.code === code);
      let cartProduct = this.state.cart.find(item => item.code === code); 

      if (cartProduct) { // если товар уже есть в корзине учеличиваем его количество и цену

          // console.log('есть - cartProduct');
          
          let newCart = this.state.cart.map(item =>
            item.code === code
              ? { ...item, quantity: item.quantity + 1, price: item.price + product.price }
              : item
          );
          this.setState({...this.state, cart: newCart});

          
      } 
      else {
          // если такого товара нет в корзине добавляем его в нее

           // console.log('нет - cartProduct');
           // console.log(product);

          this.setState({...this.state, cart: [...this.state.cart, { ...product, quantity: 1}]});

      }

  }
  
}

export default Store;
