import {useEffect, useState} from "react";
import {
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
} from "three";

import type {AppLocale} from "@/i18n/routing";
import type {CoreIdentity, PortfolioNode} from "@/lib/portfolio-types";

import {createProjectFallbackTexture} from "./createProjectFallbackTexture";

export type ProjectCoverTexture = {
  texture: Texture;
  uvOffset: Vector2;
  uvScale: Vector2;
};

type CacheEntry = {
  promise: Promise<ProjectCoverTexture> | null;
  value: ProjectCoverTexture | null;
  users: number;
};

const cache = new Map<string, CacheEntry>();
const maximumCachedTextures = 8;

function trimCache() {
  if (cache.size <= maximumCachedTextures) return;
  for (const [key, entry] of cache) {
    if (entry.users > 0 || !entry.value) continue;
    entry.value.texture.dispose();
    cache.delete(key);
    if (cache.size <= maximumCachedTextures) break;
  }
}

function acquire(key: string, factory: () => Promise<ProjectCoverTexture>) {
  let entry = cache.get(key);
  if (!entry) {
    entry = {promise: null, value: null, users: 0};
    const currentEntry = entry;
    currentEntry.promise = factory().then((value) => {
      currentEntry.value = value;
      trimCache();
      return value;
    }).catch((error: unknown) => {
      cache.delete(key);
      throw error;
    });
    cache.set(key, currentEntry);
  }
  entry.users += 1;
  return entry.promise!;
}

function release(key: string) {
  const entry = cache.get(key);
  if (!entry) return;
  entry.users = Math.max(0, entry.users - 1);
  trimCache();
}

function loadImageTexture(src: string): Promise<ProjectCoverTexture> {
  return new Promise((resolve, reject) => {
    const loader = new TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(src, (texture) => {
      const image = texture.image as {width: number; height: number};
      const imageAspect = image.width / image.height;
      const targetAspect = 16 / 9;
      const uvScale = new Vector2(1, 1);
      const uvOffset = new Vector2(0, 0);

      if (imageAspect > targetAspect) {
        uvScale.x = targetAspect / imageAspect;
        uvOffset.x = (1 - uvScale.x) / 2;
      } else {
        uvScale.y = imageAspect / targetAspect;
        uvOffset.y = (1 - uvScale.y) / 2;
      }
      texture.repeat.copy(uvScale);
      texture.offset.copy(uvOffset);
      texture.colorSpace = SRGBColorSpace;
      resolve({texture, uvOffset, uvScale});
    }, undefined, reject);
  });
}

export function useProjectCoverTexture(
  node: PortfolioNode | CoreIdentity,
  locale: AppLocale,
  active: boolean,
) {
  const [cover, setCover] = useState<ProjectCoverTexture | null>(null);

  useEffect(() => {
    if (!active) {
      setCover(null);
      return;
    }

    let mounted = true;
    const acquiredKeys = new Set<string>();
    const claim = (key: string, factory: () => Promise<ProjectCoverTexture>) => {
      acquiredKeys.add(key);
      return acquire(key, factory);
    };

    const requestCover = async () => {
      let nextCover: ProjectCoverTexture | null = null;
      if (node.image) {
        try {
          nextCover = await claim(
            `image:${node.image.src}`,
            () => loadImageTexture(node.image!.src),
          );
        } catch {
          if (!mounted) return;
        }
      }
      if (!nextCover && mounted) {
        nextCover = await claim(
          `fallback:${node.id}:${locale}`,
          () => createProjectFallbackTexture(node, locale),
        );
      }
      if (mounted) setCover(nextCover);
    };

    void requestCover().catch(() => {
      if (mounted) setCover(null);
    });
    return () => {
      mounted = false;
      acquiredKeys.forEach(release);
    };
  }, [active, locale, node]);

  return cover;
}
