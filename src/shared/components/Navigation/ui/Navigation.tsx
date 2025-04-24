import type { FC } from 'react';
import type { INavigationProps, INavigationLink } from '../interface/interface';

import { Link } from 'react-scroll';

import '../styles/style.css';

const Navigation: FC<INavigationProps> =  ({ links, color, onClick }) => {

  return (
    <nav className='navigation'>
      <ul className='navigation__list'>
        {
          links.map((link: INavigationLink) => (
            <li className={`navigation__item navigation__item_color_${color}`} key={link.id}>
              <Link
                to={link.id} 
                smooth={true} 
                offset={link.offset} 
                duration={link.duration} 
                spy={true}
                onClick={onClick ? onClick : () => console.log('link')}
              >
                {link.name}
              </Link>
            </li>
          ))
        }
      </ul>
    </nav>
  );
};

export default Navigation;
