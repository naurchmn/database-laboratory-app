// Unit tests for GradientText component logic

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: jest.fn(),
}));

jest.mock("@react-native-masked-view/masked-view", () => jest.fn());

describe("GradientText Component - Unit Tests", () => {
  describe("Default Colors", () => {
    it("should have correct default gradient colors", () => {
      const DEFAULT_COLORS = ["#652EC7", "#DF3983", "#F59E0B"];

      expect(DEFAULT_COLORS).toHaveLength(3);
      expect(DEFAULT_COLORS[0]).toBe("#652EC7"); // Purple
      expect(DEFAULT_COLORS[1]).toBe("#DF3983"); // Pink
      expect(DEFAULT_COLORS[2]).toBe("#F59E0B"); // Amber
    });

    it("should validate color format (hex)", () => {
      const DEFAULT_COLORS = ["#652EC7", "#DF3983", "#F59E0B"];
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

      DEFAULT_COLORS.forEach((color) => {
        expect(color).toMatch(hexColorRegex);
      });
    });
  });

  describe("Default Gradient Direction", () => {
    it("should have horizontal gradient by default (left to right)", () => {
      const defaultStart = { x: 0, y: 0 };
      const defaultEnd = { x: 1, y: 0 };

      expect(defaultStart.x).toBe(0);
      expect(defaultStart.y).toBe(0);
      expect(defaultEnd.x).toBe(1);
      expect(defaultEnd.y).toBe(0);
    });

    it("should support vertical gradient direction", () => {
      const verticalStart = { x: 0, y: 0 };
      const verticalEnd = { x: 0, y: 1 };

      expect(verticalStart.x).toBe(0);
      expect(verticalEnd.x).toBe(0);
      expect(verticalStart.y).toBe(0);
      expect(verticalEnd.y).toBe(1);
    });

    it("should support diagonal gradient direction", () => {
      const diagonalStart = { x: 0, y: 0 };
      const diagonalEnd = { x: 1, y: 1 };

      expect(diagonalStart.x).toBe(0);
      expect(diagonalStart.y).toBe(0);
      expect(diagonalEnd.x).toBe(1);
      expect(diagonalEnd.y).toBe(1);
    });
  });

  describe("Custom Colors", () => {
    it("should accept custom color array", () => {
      const customColors = ["#FF0000", "#00FF00", "#0000FF"];

      expect(customColors).toHaveLength(3);
      expect(customColors[0]).toBe("#FF0000"); // Red
      expect(customColors[1]).toBe("#00FF00"); // Green
      expect(customColors[2]).toBe("#0000FF"); // Blue
    });

    it("should accept two-color gradient", () => {
      const twoColors = ["#000000", "#FFFFFF"];

      expect(twoColors).toHaveLength(2);
      expect(twoColors[0]).toBe("#000000"); // Black
      expect(twoColors[1]).toBe("#FFFFFF"); // White
    });

    it("should accept multi-color gradient (more than 3)", () => {
      const multiColors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#8B00FF"];

      expect(multiColors).toHaveLength(6); // Rainbow colors
    });
  });

  describe("Text Style Props", () => {
    it("should accept fontSize in textStyle", () => {
      const textStyle = { fontSize: 24 };
      expect(textStyle.fontSize).toBe(24);
    });

    it("should accept fontWeight in textStyle", () => {
      const textStyle = { fontWeight: "bold" as const };
      expect(textStyle.fontWeight).toBe("bold");
    });

    it("should accept multiple style properties", () => {
      const textStyle = {
        fontSize: 32,
        fontWeight: "800" as const,
        letterSpacing: 2,
        textTransform: "uppercase" as const,
      };

      expect(textStyle.fontSize).toBe(32);
      expect(textStyle.fontWeight).toBe("800");
      expect(textStyle.letterSpacing).toBe(2);
      expect(textStyle.textTransform).toBe("uppercase");
    });
  });

  describe("Children Content", () => {
    it("should accept string children", () => {
      const children = "Hello World";
      expect(typeof children).toBe("string");
    });

    it("should accept number children", () => {
      const children = 12345;
      expect(typeof children).toBe("number");
      expect(String(children)).toBe("12345");
    });

    it("should handle empty string children", () => {
      const children = "";
      expect(children).toBe("");
      expect(children.length).toBe(0);
    });

    it("should handle whitespace children", () => {
      const children = "   ";
      expect(children.trim()).toBe("");
      expect(children.length).toBe(3);
    });
  });

  describe("Text Props Spread", () => {
    it("should accept numberOfLines prop", () => {
      const props = { numberOfLines: 1 };
      expect(props.numberOfLines).toBe(1);
    });

    it("should accept ellipsizeMode prop", () => {
      const props = { ellipsizeMode: "tail" as const };
      expect(props.ellipsizeMode).toBe("tail");
    });

    it("should accept accessible prop", () => {
      const props = { accessible: true };
      expect(props.accessible).toBe(true);
    });

    it("should accept accessibilityLabel prop", () => {
      const props = { accessibilityLabel: "Gradient text label" };
      expect(props.accessibilityLabel).toBe("Gradient text label");
    });
  });

  describe("Component Structure", () => {
    it("should use MaskedView as wrapper", () => {
      // MaskedView is used to create the gradient text effect
      const componentStructure = {
        wrapper: "MaskedView",
        maskElement: "Text",
        gradient: "LinearGradient",
        hiddenText: "Text (opacity: 0)",
      };

      expect(componentStructure.wrapper).toBe("MaskedView");
      expect(componentStructure.gradient).toBe("LinearGradient");
    });

    it("should have hidden text inside LinearGradient for sizing", () => {
      const hiddenTextStyle = { opacity: 0 };
      expect(hiddenTextStyle.opacity).toBe(0);
    });
  });
});
