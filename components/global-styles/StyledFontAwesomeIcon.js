import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

export default styled(FontAwesomeIcon)`
  color: ${props =>
    props.colors && props.colors.default
      ? props.colors.default
      : props.theme.primary};
  &:hover {
    color: ${props =>
      props.colors && props.colors.hover
        ? props.colors.hover
        : props.theme.primary_light};
    cursor: pointer;
  }
`;
