import React from 'react';

export interface IconProps {
  size?: number | string;
  width?: number | string;
  height?: number | string;
  color?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  backgroundColor?: string;
  borderRadius?: number | string;
}

/**
 * Creates a React icon component from an SVG string
 * @param svgString - The SVG markup as a string
 * @param defaultProps - Default props for the icon
 * @returns A React functional component
 */
export function createIconComponent(
  svgString: string,
  defaultProps: Partial<IconProps> = {}
) {
  return React.forwardRef<SVGSVGElement, IconProps>(function IconComponent(props, ref) {
    const {
      size = 24,
      width,
      height,
      color,
      fill,
      stroke,
      strokeWidth,
      className = '',
      style = {},
      onClick,
      backgroundColor,
      borderRadius,
      ...restProps
    } = { ...defaultProps, ...props };

    // Calculate dimensions
    const iconWidth = width || size;
    const iconHeight = height || size;

    // Parse the SVG string to extract attributes and content
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');

    if (!svgElement) {
      console.error('Invalid SVG string provided');
      return null;
    }

    // Extract the SVG content (everything inside the <svg> tag)
    const svgContent = svgElement.innerHTML;

    // Create container styles
    const containerStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    };

    if (backgroundColor) {
      containerStyle.backgroundColor = backgroundColor;
      containerStyle.borderRadius = borderRadius || '4px';
      containerStyle.padding = '4px';
    }

    // Create SVG props
    const svgProps: React.SVGProps<SVGSVGElement> = {
      width: iconWidth,
      height: iconHeight,
      viewBox: svgElement.getAttribute('viewBox') || '0 0 24 24',
      fill: fill || color || 'currentColor',
      stroke: stroke,
      strokeWidth: strokeWidth,
      className,
      style: {
        display: 'block',
        ...style,
      },
      onClick,
      ref,
      ...restProps,
    };

    return (
      <span style={containerStyle}>
        <svg {...svgProps} dangerouslySetInnerHTML={{ __html: svgContent }} />
      </span>
    );
  });
}

/**
 * Utility function to create an icon component from SVG string with predefined props
 * @param svgString - The SVG markup as a string
 * @param options - Configuration options
 * @returns A React functional component
 */
export function makeSvgIcon(
  svgString: string,
  options: {
    defaultSize?: number;
    defaultColor?: string;
    defaultFill?: string;
    defaultStroke?: string;
    defaultStrokeWidth?: number;
    displayName?: string;
  } = {}
) {
  const {
    defaultSize = 24,
    defaultColor = 'currentColor',
    defaultFill,
    defaultStroke,
    defaultStrokeWidth,
    displayName = 'SvgIcon',
  } = options;

  const IconComponent = createIconComponent(svgString, {
    size: defaultSize,
    color: defaultColor,
    fill: defaultFill,
    stroke: defaultStroke,
    strokeWidth: defaultStrokeWidth,
  });

  IconComponent.displayName = displayName;

  return IconComponent;
}

// Example usage:
/*
// Create a custom icon component
const MyIcon = makeSvgIcon('<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>', {
  defaultSize: 24,
  defaultColor: '#333',
  displayName: 'MyIcon'
});

// Use the icon
<MyIcon size={32} color="blue" backgroundColor="#f0f0f0" />
*/
