import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnChanges,
  DoCheck,
  SimpleChanges,
  SimpleChange,
  AfterViewInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  HostListener,
  PLATFORM_ID,
  Inject,
  ElementRef
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { IEsSliderData } from './es-image';

@Component({
  selector: 'es-image-slider',
  templateUrl: './es-image-slider.component.html',
  styleUrls: ['./es-image-slider.component.scss']
})
export class EsImageSliderComponent implements OnChanges, OnInit, DoCheck, AfterViewInit, OnDestroy {
  @ViewChild('slider', { static: false }) slider: ElementRef;
  @Output() imageClick = new EventEmitter<IEsSliderData>();
  @Output() arrowClick = new EventEmitter<string>();
  @Input() infinite: boolean;
  @Input() imageAction: boolean;
  @Input() paginationShow: boolean;
  @Input() arrowKeyMove: boolean;
  @Input() imageRatio: boolean;
  @Input() hasCaption: boolean;
  @Input() imagePadding: number;
  @Input() images: Array<IEsSliderData>;
  @Input() slideFull: boolean; // If set to true, this property overrides slideBy property
  @Input() hideBoxShadow: boolean;

  @Input() set imageSize(data) {
    if (data) {
      if (data.hasOwnProperty('space') && data['space'] > -1) {
        this.imageMargin = data['space'];
      }
      if (data.hasOwnProperty('width')) {
        this.sliderImageReceivedWidth = data['width'];
      }
      if (data.hasOwnProperty('height')) {
        this.sliderImageReceivedHeight = data['height'];
      }
    }
  }

  @Input() set animationSpeed(data: number) {
    if (data && data >= 0.1 && data <= 5) {
      this.speed = data;
      this.effectStyle = `all ${ this.speed }s ease-in-out`;
    }
  }

  @Input() set slideBy(count: number) {
    if (count) {
      this.slideImageCount = Math.round(count);
    }
  }

  @Input() set autoSlide(count) {
    if (count && (typeof count === 'number' || typeof count === 'boolean')) {
      if (typeof count === 'number' && count >= 1 && count <= 5) {
        count = Math.round(count);
      } else if (typeof count === 'boolean') {
        count = 1;
      }
      this.autoSlideCount = count * 1000;
    }
  }

  @Input() set showArrow(flag) {
    if (flag !== undefined && typeof flag === 'boolean') {
      this.showArrowButton = flag;
    }
  }

  sliderMainDivWidth: number;
  imageParentDivWidth: number;
  data: Array<IEsSliderData>;
  totalImages: number;
  leftPos: number;
  effectStyle: string;
  speed: number;
  sliderPrevDisable: boolean;
  sliderNextDisable: boolean;
  slideImageCount: number;
  sliderImageWidth: number;
  sliderImageReceivedWidth: number | string;
  sliderImageHeight: number;
  sliderImageReceivedHeight: number | string;
  sliderImageSizeWithPadding: number;
  autoSlideCount: number;
  autoSlideInterval;
  showArrowButton: boolean;
  imageMargin: number;
  swipeCoord?: [number, number];
  swipeTime?: number;
  visibleImageIndex: number;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setSliderWidth();
    if (this.slideFull) {
      this.setFullSlideCount();
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event && event.key) {
      if (event.key.toLowerCase() === 'arrowright' && this.arrowKeyMove) {
        this.next();
      }

      if (event.key.toLowerCase() === 'arrowleft' && this.arrowKeyMove) {
        this.prev();
      }
    }
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.sliderMainDivWidth = 0;
    this.imageParentDivWidth = 0;
    this.data = [];
    this.totalImages = 0;
    this.leftPos = 0;
    this.effectStyle = 'all 1s ease-in-out';
    this.speed = 1;
    this.sliderPrevDisable = false;
    this.sliderNextDisable = false;
    this.slideImageCount = 1;
    this.sliderImageWidth = 205;
    this.sliderImageReceivedWidth = 205;
    this.sliderImageHeight = 200;
    this.sliderImageReceivedHeight = 205;
    this.sliderImageSizeWithPadding = 211;
    this.autoSlideCount = 0;
    this.showArrowButton = true;
    this.imageMargin = 3;
    this.visibleImageIndex = 0;
    this.infinite = false;
    this.imageAction = true;
    this.paginationShow = false;
    this.arrowKeyMove = true;
    this.imageRatio = false;
    this.images = [];
    this.imagePadding = 0;
    this.hasCaption = false;
    this.hideBoxShadow = false;
  }

  ngOnInit() {
    if (this.infinite) {
      this.effectStyle = 'none';
      this.leftPos = -1 * this.sliderImageSizeWithPadding * this.slideImageCount;
      for (let i = 1; i <= this.slideImageCount; i++) {
        this.data.unshift(this.data[this.data.length - i]);
      }
    }
  }

  ngAfterViewInit() {
    this.setSliderWidth();
    this.changeDetectorRef.detectChanges();
    if (isPlatformBrowser(this.platformId)) {
      this.imageAutoSlide();
    }
    if (this.slideFull) {
      this.setFullSlideCount();
    }
  }

  ngOnDestroy() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.images
      && changes.images.hasOwnProperty('previousValue')
      && changes.images.hasOwnProperty('currentValue')
      && changes.images.previousValue !== changes.images.currentValue) {
      this.setSliderImages(changes.images.currentValue);
    }
    if (changes && changes.imageSize) {
      const size: SimpleChange = changes.imageSize;
      if (size
        && size.previousValue
        && size.currentValue
        && size.previousValue.width && size.previousValue.height
        && size.currentValue.width && size.currentValue.height
        && (size.previousValue.width !== size.currentValue.width
          || size.previousValue.height !== size.currentValue.height)) {
        this.setSliderWidth();
      }
    }
  }

  ngDoCheck() {
    if (this.images) {
      this.setSliderImages(this.images);
    }
  }

  setSliderImages(imgObj) {
    if (imgObj && imgObj instanceof Array && imgObj.length) {
      this.data = imgObj.map((img, index) => {
        img['index'] = index;
        return img;
      });

      this.totalImages = this.data.length;
      this.setSliderWidth();
    }
  }

  setSliderWidth() {
    if (this.slider && this.slider.nativeElement && this.slider.nativeElement.offsetWidth) {
      this.sliderMainDivWidth = this.slider.nativeElement.offsetWidth;
    }

    if (this.sliderMainDivWidth && this.sliderImageReceivedWidth) {
      if (typeof this.sliderImageReceivedWidth === 'number') {
        this.sliderImageWidth = this.sliderImageReceivedWidth;
      } else if (typeof this.sliderImageReceivedWidth === 'string') {
        if (this.sliderImageReceivedWidth.indexOf('px') >= 0) {
          this.sliderImageWidth = parseFloat(this.sliderImageReceivedWidth);
        } else if (this.sliderImageReceivedWidth.indexOf('%') >= 0) {
          this.sliderImageWidth = +((this.sliderMainDivWidth * parseFloat(this.sliderImageReceivedWidth)) / 100).toFixed(2);
        } else if (parseFloat(this.sliderImageReceivedWidth)) {
          this.sliderImageWidth = parseFloat(this.sliderImageReceivedWidth);
        }
      }
    }

    if (window && window.innerHeight && this.sliderImageReceivedHeight) {
      if (typeof this.sliderImageReceivedHeight === 'number') {
        this.sliderImageHeight = this.sliderImageReceivedHeight;
      } else if (typeof this.sliderImageReceivedHeight === 'string') {
        if (this.sliderImageReceivedHeight.indexOf('px') >= 0) {
          this.sliderImageHeight = parseFloat(this.sliderImageReceivedHeight);
        } else if (this.sliderImageReceivedHeight.indexOf('%') >= 0) {
          this.sliderImageHeight = +((window.innerHeight * parseFloat(this.sliderImageReceivedHeight)) / 100).toFixed(2);
        } else if (parseFloat(this.sliderImageReceivedHeight)) {
          this.sliderImageHeight = parseFloat(this.sliderImageReceivedHeight);
        }
      }
    }

    this.sliderImageSizeWithPadding = this.sliderImageWidth + (this.imageMargin * 2);
    this.imageParentDivWidth = this.data.length * this.sliderImageSizeWithPadding;
    this.nextPrevSliderButtonDisable();
  }

  imageOnClick(image: IEsSliderData) {
    if (this.imageAction) {
      this.imageClick.emit(image);
    }
  }

  imageAutoSlide() {
    if (this.infinite && this.autoSlideCount) {
      this.autoSlideInterval = setInterval(() => {
        this.next();
      }, this.autoSlideCount);
    }
  }

  imageMouseEnterHandler() {
    if (this.infinite && this.autoSlideCount && this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  prev() {
    if (!this.sliderPrevDisable) {
      if (this.infinite) {
        this.infinitePrevImg();
      } else {
        this.prevImg();
      }
      this.sliderArrowDisableTeam();
      this.getVisibleIndex();
    }
  }

  next() {
    if (!this.sliderNextDisable) {
      if (this.infinite) {
        this.infiniteNextImg();
      } else {
        this.nextImg();
      }
      this.sliderArrowDisableTeam();
      this.getVisibleIndex();
    }
  }

  prevImg() {
    if (0 >= this.leftPos + (this.sliderImageSizeWithPadding * this.slideImageCount)) {
      this.leftPos += this.sliderImageSizeWithPadding * this.slideImageCount;
    } else {
      this.leftPos = 0;
    }
  }

  nextImg() {
    if ((this.imageParentDivWidth + this.leftPos) - this.sliderMainDivWidth > this.sliderImageSizeWithPadding * this.slideImageCount) {
      this.leftPos -= this.sliderImageSizeWithPadding * this.slideImageCount;
    } else if ((this.imageParentDivWidth + this.leftPos) - this.sliderMainDivWidth > 0) {
      this.leftPos -= (this.imageParentDivWidth + this.leftPos) - this.sliderMainDivWidth;
    }
  }

  infinitePrevImg() {
    this.effectStyle = `all ${ this.speed }s ease-in-out`;
    this.leftPos = 0;

    setTimeout(() => {
      this.effectStyle = 'none';
      this.leftPos = -1 * this.sliderImageSizeWithPadding * this.slideImageCount;
      for (let i = 0; i < this.slideImageCount; i++) {
        this.data.unshift(this.data[this.data.length - this.slideImageCount - 1]);
        this.data.pop();
      }
    }, this.speed * 1000);
  }

  infiniteNextImg() {
    this.effectStyle = `all ${ this.speed }s ease-in-out`;
    this.leftPos = -2 * this.sliderImageSizeWithPadding * this.slideImageCount;
    setTimeout(() => {
      this.effectStyle = 'none';
      for (let i = 0; i < this.slideImageCount; i++) {
        this.data.push(this.data[this.slideImageCount]);
        this.data.shift();
      }
      this.leftPos = -1 * this.sliderImageSizeWithPadding * this.slideImageCount;
    }, this.speed * 1000);
  }

  getVisibleIndex() {
    const currentIndex = Math.round((Math.abs(this.leftPos) + this.sliderImageWidth) / this.sliderImageWidth);
    if (this.data[currentIndex - 1] && this.data[currentIndex - 1]['index'] !== undefined) {
      this.visibleImageIndex = this.data[currentIndex - 1]['index'];
    }
  }

  sliderArrowDisableTeam() {
    this.sliderNextDisable = true;
    this.sliderPrevDisable = true;
    setTimeout(() => {
      this.nextPrevSliderButtonDisable();
    }, this.speed * 1000);
  }

  nextPrevSliderButtonDisable() {
    this.sliderNextDisable = false;
    this.sliderPrevDisable = false;
    if (!this.infinite) {
      if (this.imageParentDivWidth + this.leftPos <= this.sliderMainDivWidth) {
        this.sliderNextDisable = true;
      }

      if (this.leftPos >= 0) {
        this.sliderPrevDisable = true;
      }
    }
  }

  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;

      if (duration < 1000 && Math.abs(direction[0]) > 30 && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
        if (direction[0] < 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }
  }

  setFullSlideCount() {
    const sliderElementWidth = Math.round(this.elementRef.nativeElement.offsetWidth);
    this.slideImageCount = Math.floor(sliderElementWidth / this.sliderImageSizeWithPadding);
  }
}
