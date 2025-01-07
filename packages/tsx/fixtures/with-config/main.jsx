import { Wrapper } from './wrapper.jsx';

export function Greet({ name }) {
	return (<h1>Hello <Wrapper>{name}</Wrapper></h1>);
}
Greet.displayName = 'Greet';
