import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

export default styled(FontAwesomeIcon)`
  color: ${props =>
    props.colors ? props.colors.primary : props.theme.primary};
  &:hover {
    color: ${props =>
      props.colors ? props.colors.hover : props.theme.primary_light};
    cursor: pointer;
  }
`;
