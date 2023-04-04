/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Svg, {type SvgIconProps} from '@site/src/components/Svg';

export default function FavoriteIcon(
  props: Omit<SvgIconProps, 'children'>,
): JSX.Element {
  return (
    <Svg  {...props} width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.6513 0.72998C11.68 0.72998 11.0045 1.08598 9.91 2.01998C9.85925 2.06323 9.5725 2.30998 9.4895 2.38048C9.3527 2.49632 9.17925 2.55988 9 2.55988C8.82075 2.55988 8.6473 2.49632 8.5105 2.38048C8.4275 2.30973 8.14075 2.06323 8.09 2.01998C6.9955 1.08598 6.32 0.72998 5.34875 0.72998C2.395 0.72998 0.5 3.09198 0.5 6.50073C0.5 9.09998 3.16075 12.326 8.5695 16.0662C8.69609 16.1535 8.84623 16.2003 9 16.2003C9.15377 16.2003 9.30391 16.1535 9.4305 16.0662C14.8392 12.3262 17.5 9.09998 17.5 6.50073C17.5 3.09198 15.605 0.72998 12.6513 0.72998Z" fill="#F13557"/>
    </Svg>
  );
}
