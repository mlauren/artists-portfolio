import { fromEvent, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Component, OnInit, Input, Inject, SimpleChanges, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';  
import { DomSanitizer, SafeResourceUrl, Meta,Title } from '@angular/platform-browser';
import { Router, RouterModule, ActivatedRoute, NavigationEnd, RouterEvent, Event, ChildActivationEnd, ParamMap, Params} from '@angular/router';

import { Album } from '../../models/album.model';
import { SanityService } from '../../services/sanity.service';
import { WindowRefService } from '../../services/window-ref.service';
import { AlbumSharedService } from '../../services/album-shared.service';
import { Image } from '../../models/image.model';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit, OnDestroy {

  albumId: string;
  album: Album;
  resizeObservable$: Observable<any>;
  resizeSubscription$: Subscription;
  activePaginationItems: [];
  isMobile: boolean;
  homePage: boolean;
  isBrowser: boolean;
  imgIndex: number;
  maxPagination: number;
  desHeight: string;
  currPermalink: string;
  images: any;
  child: ActivatedRoute;
  subscription: any;
  imgControls: any;
  paginationCtrl: any;
  sanityInstance: any;
  sanityImgBuilder: any;
  albumSharedSubscription: Subscription;
  isLoading: boolean = false;

  constructor(
    private sanityService: SanityService,
    private albumSharedService: AlbumSharedService,
    private route: ActivatedRoute,
    public router: Router,
    private meta: Meta,
    private title: Title,
    @Inject(WindowRefService) private window: Window,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.isBrowser = isPlatformBrowser(platformId);


    this.maxPagination = 6;
  }

  ngOnInit() {
    this.sanityImgBuilder = this.sanityService.getImageUrlBuilder();

    this.route.params.subscribe(routeParams => {
      this.isLoading = true;
      // Homepage route params
      this.homePage = !routeParams.imgId; // opposite of child page

      if (this.homePage) {
        this.imgIndex=0;
      }
      this.currPermalink = routeParams.permalink;

      if (this.albumSharedService.images) {
        this.images = this.albumSharedService.images;

        // If there are images inherited from album service, update slides if needed
        this.updateCurrentImgAndIndex(routeParams);
        this.isLoading = false;
      }
    });

    this.albumSharedSubscription = this.albumSharedService.imagesChanged.subscribe((data) => {
      this.images = data;

      if (this.images) {
        this.updateCurrentImgAndIndex(this.route.snapshot.params);
      }
      this.isLoading = false;
    });
  }

  updateCurrentImgAndIndex(routeParams) {
    if (this.images && this.images.length > 0) {

      this.imgIndex = !this.homePage ? this.images.findIndex((item) => {
        return item.asset.assetId === routeParams.imgId;
      }) : 0;

      const currImg = this.images[this.imgIndex];
      this.updateMeta({image: currImg.asset.url});
    }
  }

  isCorrectIndex(id) {
    return parseInt(id) === this.imgIndex;
  }

  urlFor(source: string) {
    return this.sanityImgBuilder.image(source)
  }

  ngOnDestroy() {
    if (this.albumSharedSubscription) this.albumSharedSubscription.unsubscribe();
  }

  updateMeta(data) {
    this.meta.updateTag({name: 'twitter:image', content: data.image });
    this.meta.updateTag({property: 'og:image', content: data.image });
  }
}
