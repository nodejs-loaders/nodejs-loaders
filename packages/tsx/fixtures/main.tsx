import { Wrapper } from './wrapper.jsx';

export function Greet({ name }: { name: string }) {
	return (<h1>Hello <Wrapper>{name}</Wrapper></h1>);
}
Greet.displayName = 'Greet';
