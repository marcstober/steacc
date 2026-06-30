from typing import Sequence, Tuple, Union

import pygame

# imitate pygame types for type checking
RGBAOutput = Tuple[int, int, int, int]
ColorValue = Union[
    pygame.Color, int, str, Tuple[int, int, int], RGBAOutput, Sequence[int]
]
Coordinate = Union[Tuple[float, float], Sequence[float], pygame.math.Vector2]


class RectSprite(pygame.sprite.Sprite):
    """
    A RectSprite must be given a color and a rect.
    This is analogous to the pygame.draw.rect function for drawing a rectangle.
    It's recommended to use the `create` class method to instantiate this sprite.
    """

    color: ColorValue
    rect: pygame.Rect
    image: pygame.Surface

    @classmethod
    def create(cls, color, rect, *groups):
        # This is done as a classmethod, not in the constructor,
        # to keep type checkers happy since they don't like
        # the constructor having a different signature than that of the base class.
        sprite = cls(*groups)
        sprite.color = color
        sprite.rect = pygame.Rect(rect)
        sprite.image = pygame.Surface(sprite.rect.size)
        sprite.update()
        return sprite

    def update(self) -> None:
        # TODO: Improve performance by only updating if needed?
        #  (i. e., color changes)
        pygame.draw.rect(self.image, self.color, self.image.get_rect())
