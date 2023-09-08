import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTimelineDraggable]',
})
export class TimelineDraggableDirective {
  private isDragging: boolean = false;
  private startX: number = 0;
  private offsetX: number = 0;
  private maxOffsetX: number = 0; // Maksymalny offset dozwolony w lewo
  private contentWiderThanParent: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.checkContentWidth(); // Wywołaj to przy inicjalizacji
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseDown(event: MouseEvent | TouchEvent): void {
    if (!this.contentWiderThanParent) return; // Nie aktywuj przesuwania, jeśli nie jest to możliwe
    this.isDragging = true;
    this.startX =
      event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    this.offsetX = parseFloat(
      getComputedStyle(this.el.nativeElement)
        .getPropertyValue('transform')
        .split(',')[4]
    );
    this.maxOffsetX = 0; // Zresetuj maksymalny offset
    this.renderer.addClass(this.el.nativeElement, 'grabbing');
    this.renderer.removeClass(this.el.nativeElement, 'active');
  }

  @HostListener('mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])
  onMouseMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    const clientX =
      event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const deltaX = clientX - this.startX;

    // Ogranicz przesuwanie w prawo do maksymalnego offsetu
    if (this.offsetX + deltaX > this.maxOffsetX) {
      return;
    }

    this.el.nativeElement.style.transform = `translateX(${
      this.offsetX + deltaX
    }px)`;
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  @HostListener('touchend')
  @HostListener('touchcancel')
  onMouseUp(): void {
    this.isDragging = false;
    this.renderer.removeClass(this.el.nativeElement, 'grabbing');
  }

  private checkContentWidth(): void {
    const contentWidth = this.el.nativeElement.scrollWidth;
    const parentWidth = this.el.nativeElement.parentElement.offsetWidth;
    this.contentWiderThanParent = contentWidth > parentWidth;

    if (!this.contentWiderThanParent) {
      this.maxOffsetX = contentWidth - parentWidth; // Ustal maksymalny offset, jeśli nie jest to możliwe
    }
  }
}
