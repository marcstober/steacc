import pygame


class ImageSprite(pygame.sprite.Sprite):
    rect: pygame.Rect
    image: pygame.Surface

    @classmethod
    def from_filename(
        cls, filename, *groups, scale_to_size: None | tuple[int, int] = None
    ):
        # This is done as a classmethod, not in the constructor,
        # to keep type checkers happy since they don't like
        # the constructor having a different signature than that of the base class.
        sprite = cls(*groups)
        sprite.image = pygame.image.load(filename).convert_alpha()
        if scale_to_size:
            sprite.image = pygame.transform.scale(sprite.image, scale_to_size)
        sprite.rect = sprite.image.get_rect()
        return sprite
